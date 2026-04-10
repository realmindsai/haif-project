import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const TEST_FILE_PATTERN = /\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/;
const OPTIONS_WITH_VALUES = new Set([
  '-c',
  '-t',
  '--api',
  '--browser',
  '--changed',
  '--config',
  '--coverage.provider',
  '--coverage.reportsDirectory',
  '--coverage.reporter',
  '--dir',
  '--environment',
  '--mode',
  '--pool',
  '--project',
  '--reporter',
  '--root',
  '--sequence',
  '--testNamePattern',
]);
const [, , scopeDirectory, ...rawArgs] = process.argv;

if (!scopeDirectory) {
  console.error('Usage: node scripts/run-vitest-scope.mjs <scope-directory> [filter...]');
  process.exit(1);
}

const filters = [];
const forwardedVitestArgs = [];

for (let index = 0; index < rawArgs.length; index += 1) {
  const arg = rawArgs[index];

  if (arg.startsWith('-')) {
    forwardedVitestArgs.push(arg);

    if (!arg.includes('=') && OPTIONS_WITH_VALUES.has(arg) && index + 1 < rawArgs.length) {
      forwardedVitestArgs.push(rawArgs[index + 1]);
      index += 1;
    }

    continue;
  }

  filters.push(arg);
}

function collectTestFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return collectTestFiles(absolutePath);
    }

    if (entry.isFile() && TEST_FILE_PATTERN.test(entry.name)) {
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

if (filters.length > 0 && targetFiles.length === 0) {
  console.error(
    `No test files matched filters "${filters.join(', ')}" within "${scopeDirectory}".`,
  );
  process.exit(1);
}

if (targetFiles.length === 0) {
  process.exit(0);
}

const result = spawnSync(
  'vitest',
  ['run', '--passWithNoTests', ...forwardedVitestArgs, ...targetFiles],
  {
    env: process.env,
    stdio: 'inherit',
  },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
