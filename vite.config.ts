import { defineConfig, type Plugin } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';

// Identify the actual checkout, rather than accepting another game's title/manifest.
function projectIdentity(): Plugin {
  const root = realpathSync(process.cwd());
  const install = (server: { middlewares: { use: (...args: any[]) => void } }) => {
    server.middlewares.use('/__diktator/status', (_request: unknown, response: any) => {
      try {
        const state = JSON.parse(readFileSync(resolve(root, 'project-state.json'), 'utf8'));
        const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', windowsHide: true }).trim();
        const payload = { ...state, root, branch: git('branch', '--show-current'), commit: git('rev-parse', 'HEAD') };
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify(payload));
      } catch {
        response.statusCode = 503;
        response.end('Project identity unavailable');
      }
    });
  };
  return { name: 'diktator-checkout-identity', configureServer: install, configurePreviewServer: install };
}

export default defineConfig({
  plugins: [projectIdentity()],
  server: { watch: { ignored: ['**/.tools/**', '**/.browser-profile/**', '**/.claude/**', '**/.codex/**', '**/Diktator-Kart-Legacy/**', '**/Legacy/**'] } },
});
