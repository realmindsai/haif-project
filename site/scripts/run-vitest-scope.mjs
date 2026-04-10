import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const [, , scopeDirectory, ...filters] = process.argv;

if (!scopeDirectory) {
  console.error('Usage: node scripts/run-vitest-scope.mjs <scope-directory> [filter...]');
  process.exit(1);
}

function collectTestFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return collectTestFiles(absolutePath);
    }

    if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      return [relative(process.cwd(), absolutePath)];
    }

    return [];
  });
}

const scopedFiles = collectTestFiles(resolve(process.cwd(), scopeDirectory));
const targetFiles =
  filters.length === 0
    ? scopedFiles
    : scopedFiles.filter((file) => filters.every((filter) => file.includes(filter)));

if (targetFiles.length === 0) {
  process.exit(0);
}

const result = spawnSync('vitest', ['run', '--passWithNoTests', ...targetFiles], {
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
