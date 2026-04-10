import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { parseCLI, startVitest } from 'vitest/node';

const TEST_FILE_PATTERN = /\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/;
const [, , scopeDirectory, ...rawArgs] = process.argv;

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
      return [relative(process.cwd(), absolutePath)];
    }

    return [];
  });
}

const scopedFiles = collectTestFiles(resolve(process.cwd(), scopeDirectory));

async function main() {
  const { filter: filters, options } = parseCLI(['vitest', 'run', ...rawArgs]);
  const targetFiles =
    filters.length === 0
      ? scopedFiles
      : scopedFiles.filter((file) => filters.every((filter) => file.includes(filter)));

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
