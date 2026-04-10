import { spawnSync } from 'node:child_process';
import { readdirSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { relative, resolve } from 'node:path';
import { parseCLI, startVitest } from 'vitest/node';

const TEST_FILE_PATTERN = /\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/;
const VITEST_CONTROL_FLAGS = new Set(['-h', '--help', '-v', '--version']);
const [, , scopeDirectory, ...rawArgs] = process.argv;
const require = createRequire(import.meta.url);

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

    if (entry.isFile() && TEST_FILE_PATTERN.test(entry.name)) {
      return [absolutePath];
    }

    return [];
  });
}

function runVitestCli(args) {
  const result = spawnSync(
    process.execPath,
    [require.resolve('vitest/vitest.mjs'), 'run', ...args],
    {
      env: process.env,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
}

async function main() {
  if (rawArgs.some((arg) => VITEST_CONTROL_FLAGS.has(arg))) {
    return runVitestCli(rawArgs);
  }

  const scopePath = resolve(process.cwd(), scopeDirectory);
  const projectRoot = realpathSync(resolve(process.cwd()));
  let scopedFiles;
  let resolvedScopePath;

  try {
    resolvedScopePath = realpathSync(scopePath);

    if (
      resolvedScopePath !== projectRoot &&
      !resolvedScopePath.startsWith(`${projectRoot}/`)
    ) {
      console.error(`Scope directory "${scopeDirectory}" must stay within the project root.`);
      return 1;
    }

    scopedFiles = collectTestFiles(resolvedScopePath);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      console.error(`Scope directory "${scopeDirectory}" does not exist.`);
      return 1;
    }

    throw error;
  }

  if (scopedFiles.length === 0) {
    console.error(`No test files found within "${scopeDirectory}".`);
    return 1;
  }

  const { filter: filters, options } = parseCLI(['vitest', 'run', ...rawArgs]);
  const targetFiles =
    filters.length === 0
      ? scopedFiles
      : scopedFiles.filter((file) => {
          const relativeFile = relative(projectRoot, file);
          return filters.some(
            (filter) => file.includes(filter) || relativeFile.includes(filter),
          );
        });

  if (filters.length > 0 && targetFiles.length === 0) {
    console.error(
      `No test files matched filters "${filters.join(', ')}" within "${scopeDirectory}".`,
    );
    return 1;
  }

  if (targetFiles.length === 0) {
    return 0;
  }

  await startVitest('test', targetFiles, {
    ...options,
    passWithNoTests: true,
    run: true,
  });

  return process.exitCode ?? 0;
}

try {
  process.exit(await main());
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
