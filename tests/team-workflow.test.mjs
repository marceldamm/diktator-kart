import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import http from 'node:http';

const root = resolve('.');
const workflow = join(root, 'scripts/team-workflow.ps1');
const launcher = join(root, 'scripts/start-local.ps1');
const windows = process.platform === 'win32';
function command(cwd, executable, args, good = true) {
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', windowsHide: true, timeout: 90000 });
  assert.ifError(result.error);
  if (good) assert.equal(result.status, 0, result.stdout + result.stderr);
  return result;
}
const git = (cwd, ...args) => command(cwd, 'git', args).stdout.trim();
const put = (cwd, file, content) => { const path = join(cwd, file); mkdirSync(resolve(path, '..'), { recursive: true }); writeFileSync(path, content); };
const commit = (cwd, message) => { git(cwd, 'add', '-A'); return git(cwd, 'commit', '-m', message); };
function fixture() {
  mkdirSync(join(root, '.tools'), { recursive: true });
  const folder = mkdtempSync(join(root, '.tools/team-test-'));
  const remote = join(folder, 'remote.git');
  const seed = join(folder, 'seed');
  mkdirSync(remote); mkdirSync(seed);
  git(remote, 'init', '--bare', '--initial-branch=main');
  git(seed, 'init', '--initial-branch=main');
  git(seed, 'config', 'user.name', 'Fixture'); git(seed, 'config', 'user.email', 'fixture@example.test'); git(seed, 'config', 'commit.gpgsign', 'false');
  put(seed, '.gitignore', '.tools/\nnode_modules/\n');
  put(seed, 'src/main.ts', '// Babylon fixture\n');
  put(seed, 'shared.txt', 'base\n');
  put(seed, 'docs/17-progress-log.md', '# Progress\nbase\n');
  put(seed, 'package.json', JSON.stringify({ scripts: { test: 'node -e "process.exit(0)"', build: 'node -e "process.exit(0)"' } }));
  commit(seed, 'foundation');
  const minimum = git(seed, 'rev-parse', 'HEAD');
  const state = { projectId: 'diktator-kart-babylon', engine: 'babylonjs', edition: 'fixture', minimumSourceCommit: minimum, repositoryUrl: remote, mainBranch: 'main' };
  put(seed, 'project-state.json', JSON.stringify(state)); commit(seed, 'active marker');
  git(seed, 'remote', 'add', 'origin', remote); git(seed, 'push', '-u', 'origin', 'main');
  const clones = {};
  for (const name of ['Alice', 'Bob']) {
    const cwd = join(folder, name); git(folder, 'clone', remote, cwd);
    git(cwd, 'config', 'user.name', name); git(cwd, 'config', 'user.email', `${name.toLowerCase()}@example.test`); git(cwd, 'config', 'commit.gpgsign', 'false');
    clones[name] = cwd;
  }
  return { folder, remote, state, minimum, ...clones };
}
const run = (cwd, action, good = true) => command(root, 'powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', workflow, '-Action', action, '-ProjectRoot', cwd], good);
const remoteHead = f => git(f.remote, 'rev-parse', 'main');

test('team: dirty local work is preserved and cannot be switched or published', { skip: !windows }, () => {
  const f = fixture(); const before = git(f.Alice, 'rev-parse', 'HEAD');
  put(f.Alice, 'draft.txt', 'do not lose me');
  assert.notEqual(run(f.Alice, 'Start', false).status, 0);
  assert.notEqual(run(f.Alice, 'Finish', false).status, 0);
  assert.equal(git(f.Alice, 'rev-parse', 'HEAD'), before);
  assert.equal(readFileSync(join(f.Alice, 'draft.txt'), 'utf8'), 'do not lose me');
  assert.equal(remoteHead(f), before);
});
test('team: disjoint parallel changes integrate, verify and publish as fast-forward', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start');
  assert.match(git(f.Alice, 'branch', '--show-current'), /^codex\/team-alice-/);
  put(f.Alice, 'alice.txt', 'Alice'); commit(f.Alice, 'Alice change');
  put(f.Bob, 'bob.txt', 'Bob'); commit(f.Bob, 'Bob change'); git(f.Bob, 'push', 'origin', 'main');
  const bob = remoteHead(f); run(f.Alice, 'Start');
  assert.equal(readFileSync(join(f.Alice, 'alice.txt'), 'utf8'), 'Alice');
  assert.equal(readFileSync(join(f.Alice, 'bob.txt'), 'utf8'), 'Bob');
  put(f.Alice, 'docs/17-progress-log.md', '# Progress\nbase\nAlice verified both\n'); commit(f.Alice, 'verified handoff');
  const result = run(f.Alice, 'Finish'); assert.match(result.stdout, /VEROEFFENTLICHT/);
  assert.equal(remoteHead(f), git(f.Alice, 'rev-parse', 'HEAD'));
  assert.equal(command(f.remote, 'git', ['merge-base', '--is-ancestor', bob, 'main'], false).status, 0);
});
test('team: overlapping conflicting edits are reported and remote main stays intact', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start');
  put(f.Alice, 'shared.txt', 'Alice intention\n'); commit(f.Alice, 'Alice shared change');
  put(f.Bob, 'shared.txt', 'Bob intention\n'); commit(f.Bob, 'Bob shared change'); git(f.Bob, 'push', 'origin', 'main');
  const before = remoteHead(f); const result = run(f.Alice, 'Start', false);
  assert.notEqual(result.status, 0); assert.match(result.stdout, /shared.txt/);
  const conflict = readFileSync(join(f.Alice, 'shared.txt'), 'utf8');
  assert.match(conflict, /Alice intention/); assert.match(conflict, /Bob intention/);
  assert.equal(remoteHead(f), before);
});
test('team: pre-baseline legacy work is archived, not copied into new project', { skip: !windows }, () => {
  const f = fixture(); git(f.Alice, 'switch', '-c', 'old-session', f.minimum);
  put(f.Alice, 'legacy-only.txt', 'old implementation'); commit(f.Alice, 'old local work');
  const old = git(f.Alice, 'rev-parse', 'HEAD'); run(f.Alice, 'Start');
  assert.ok(!existsSync(join(f.Alice, 'legacy-only.txt')));
  const archive = git(f.Alice, 'for-each-ref', '--format=%(refname:short)', 'refs/heads/archive/local-before-babylon-*');
  assert.equal(git(f.Alice, 'rev-parse', archive), old);
  assert.equal(git(f.Alice, 'show', `${archive}:legacy-only.txt`), 'old implementation');
  assert.equal(git(f.Alice, 'rev-parse', 'HEAD'), remoteHead(f));
});
test('team: concurrent update during build prevents an outdated main push', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start');
  put(f.Bob, 'concurrent.txt', 'new remote work'); commit(f.Bob, 'concurrent work');
  put(f.Alice, 'race-build.mjs', `import{execFileSync}from'node:child_process';execFileSync('git',['-C',${JSON.stringify(f.Bob)},'push','origin','main']);`);
  put(f.Alice, 'package.json', JSON.stringify({ scripts: { test: 'node -e "process.exit(0)"', build: 'node race-build.mjs' } }));
  put(f.Alice, 'docs/17-progress-log.md', '# Progress\nbase\nAlice handoff\n'); commit(f.Alice, 'ready for publication');
  const local = git(f.Alice, 'rev-parse', 'HEAD'); const result = run(f.Alice, 'Finish', false);
  assert.notEqual(result.status, 0); assert.match(result.stdout, /advanced during verification/);
  assert.equal(remoteHead(f), git(f.Bob, 'rev-parse', 'HEAD'));
  assert.notEqual(remoteHead(f), local); assert.equal(git(f.Alice, 'rev-parse', 'HEAD'), local);
});
test('team: failed verification cannot publish', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start'); const before = remoteHead(f);
  put(f.Alice, 'package.json', JSON.stringify({ scripts: { test: 'node -e "process.exit(1)"', build: 'node -e "process.exit(0)"' } }));
  put(f.Alice, 'docs/17-progress-log.md', '# Progress\nbase\nnot verified\n'); commit(f.Alice, 'failing change');
  assert.notEqual(run(f.Alice, 'Finish', false).status, 0); assert.equal(remoteHead(f), before);
});

async function fakeServer(payload) {
  const server = http.createServer((request, response) => {
    if (request.url === '/__diktator/status' && payload) { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(payload)); }
    else { response.end('<title>Diktator Kart</title>old version'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}
async function checkLauncher(cwd, port) {
  // Async subprocess lets the Node mock answer the launcher's HTTP probe.
  const { spawn } = await import('node:child_process');
  return new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', launcher, '-ProjectRoot', cwd, '-Port', String(port), '-CheckOnly', '-AsJson'], { windowsHide: true });
    let stdout = '', stderr = ''; child.stdout.on('data', c => stdout += c); child.stderr.on('data', c => stderr += c);
    child.on('error', reject); child.on('exit', status => resolve({ status, stdout, stderr }));
  });
}
test('launcher: old title and another worktree are never reused; same checkout is reused', { skip: !windows }, async () => {
  const f = fixture();
  for (const [payload, reuse] of [[null, false], [{ ...f.state, root: f.Bob }, false], [{ ...f.state, root: f.Alice }, true]]) {
    const server = await fakeServer(payload);
    try {
      const port = server.address().port; const result = await checkLauncher(f.Alice, port);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const probe = JSON.parse(result.stdout); assert.equal(probe.reuse, reuse);
      assert.equal(probe.root.toLowerCase(), f.Alice.toLowerCase());
      if (!reuse) assert.notEqual(probe.port, port);
      assert.equal((await fetch(`http://127.0.0.1:${port}/`)).status, 200, 'unrelated server must remain alive');
    } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  }
  git(f.Alice, 'switch', '-c', 'archive/fixture');
  const refused = await checkLauncher(f.Alice, 43999); assert.notEqual(refused.status, 0);
});
