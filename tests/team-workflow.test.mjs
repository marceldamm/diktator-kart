import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
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
  put(seed, 'PROGRESS-LOG.md', '# Progress\nbase\n');
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

for(const missing of ['TEAM-CHANGES.md','TEAM-NOTES.md'])test(`team: missing ${missing} prevents publication`, { skip: !windows }, () => {
  const f=fixture();
  put(f.Bob,'project-state.json',JSON.stringify({...f.state,teamLists:['CURRENT-WORKLIST.md','LONG-TERM-GOALS.md','TEAM-CHANGES.md','TEAM-NOTES.md']}));
  for(const file of ['CURRENT-WORKLIST.md','LONG-TERM-GOALS.md','TEAM-CHANGES.md','TEAM-NOTES.md'])if(file!==missing)put(f.Bob,file,'# Shared work file\n');
  commit(f.Bob,'new work-list contract but missing '+missing);git(f.Bob,'push','origin','main');
  put(f.Alice,'draft.txt','# Verified draft\n');commit(f.Alice,'documented work');
  const before=remoteHead(f),result=run(f.Alice,'Finish',false);
  assert.notEqual(result.status,0);assert.ok(result.stdout.includes(missing));assert.equal(remoteHead(f),before);
});

test('team: dirty local work is preserved and cannot be switched or published', { skip: !windows }, () => {
  const f = fixture(); const before = git(f.Alice, 'rev-parse', 'HEAD');
  put(f.Alice, 'draft.txt', 'do not lose me');
  assert.notEqual(run(f.Alice, 'Start', false).status, 0);
  assert.notEqual(run(f.Alice, 'Finish', false).status, 0);
  assert.equal(git(f.Alice, 'rev-parse', 'HEAD'), before);
  assert.equal(readFileSync(join(f.Alice, 'draft.txt'), 'utf8'), 'do not lose me');
  assert.equal(remoteHead(f), before);
});
test('team: checkpoint requires explicit paths and saves only the selected files to main', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start');
  put(f.Alice, 'checkpoint.txt', 'recoverable work');
  put(f.Alice, 'parallel-draft.txt', 'leave for the other worker');
  assert.notEqual(run(f.Alice, 'Checkpoint', false).status, 0, 'must not stage every concurrent edit implicitly');
  const result = command(root, 'powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', workflow, '-Action', 'Checkpoint', '-ProjectRoot', f.Alice, '-Paths', 'checkpoint.txt']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /ZWISCHENSTAND GESICHERT/);
  assert.equal(git(f.Alice, 'branch', '--show-current'), 'main');
  assert.equal(git(f.remote, 'show', 'main:checkpoint.txt'), 'recoverable work');
  assert.notEqual(command(f.remote, 'git', ['cat-file', '-e', 'main:parallel-draft.txt'], false).status, 0);
  assert.equal(readFileSync(join(f.Alice, 'parallel-draft.txt'), 'utf8'), 'leave for the other worker');
});
test('team: clean main project start fast-forwards remote work', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start');
  put(f.Bob, 'bob.txt', 'Bob'); commit(f.Bob, 'Bob change'); git(f.Bob, 'push', 'origin', 'main');
  run(f.Alice, 'Start');
  assert.equal(readFileSync(join(f.Alice, 'bob.txt'), 'utf8'), 'Bob');
  assert.equal(git(f.Alice, 'branch', '--show-current'), 'main');
});
test('team: overlapping conflicting edits are reported and remote main stays intact', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start');
  put(f.Alice, 'shared.txt', 'Alice intention\n'); commit(f.Alice, 'Alice shared change');
  put(f.Bob, 'shared.txt', 'Bob intention\n'); commit(f.Bob, 'Bob shared change'); git(f.Bob, 'push', 'origin', 'main');
  const before = remoteHead(f); const result = run(f.Alice, 'Start', false);
  assert.notEqual(result.status, 0); assert.match(result.stdout, /auseinander gelaufen/);
  assert.equal(readFileSync(join(f.Alice, 'shared.txt'), 'utf8'), 'Alice intention\n');
  assert.equal(remoteHead(f), before);
});
test('team: an unrelated or historical branch is preserved and never switched automatically', { skip: !windows }, () => {
  const f = fixture(); git(f.Alice, 'switch', '-c', 'old-session', f.minimum);
  put(f.Alice, 'legacy-only.txt', 'old implementation'); commit(f.Alice, 'old local work');
  const old = git(f.Alice, 'rev-parse', 'HEAD'); assert.notEqual(run(f.Alice, 'Start', false).status, 0);
  assert.equal(git(f.Alice, 'rev-parse', 'HEAD'), old);
  assert.equal(git(f.Alice, 'branch', '--show-current'), 'old-session');
  assert.equal(git(f.Alice, 'show', 'HEAD:legacy-only.txt'), 'old implementation');
});
test('team: finish integrates a disjoint remote commit before normal main push', { skip: !windows }, () => {
  const f = fixture(); run(f.Alice, 'Start');
  put(f.Alice, 'alice.txt', 'Alice'); commit(f.Alice, 'Alice change');
  put(f.Bob, 'bob.txt', 'Bob'); commit(f.Bob, 'Bob change'); git(f.Bob, 'push', 'origin', 'main');
  run(f.Alice, 'Finish');
  assert.equal(remoteHead(f), git(f.Alice, 'rev-parse', 'HEAD'));
  assert.equal(git(f.remote, 'show', 'main:alice.txt'), 'Alice');
  assert.equal(git(f.remote, 'show', 'main:bob.txt'), 'Bob');
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
test('launcher: old title, other worktree and static preview are never reused; own dev checkout is reused', { skip: !windows }, async () => {
  const f = fixture();
  for (const [payload, reuse] of [[null, false], [{ ...f.state, root: f.Bob, mode: 'dev' }, false], [{ ...f.state, root: f.Alice, mode: 'preview' }, false], [{ ...f.state, root: f.Alice }, false], [{ ...f.state, root: f.Alice, mode: 'dev' }, true]]) {
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
