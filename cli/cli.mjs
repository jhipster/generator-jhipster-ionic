#!/usr/bin/env node

import { runJHipster, done, logger } from 'generator-jhipster/cli';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, basename, join } from 'path';

// Get package name to use as namespace.
// Allows blueprints to be aliased.
const packagePath = dirname(dirname(fileURLToPath(import.meta.url)));
const packageFolderName = basename(packagePath);
const devBlueprintPath = join(packagePath, '.blueprint');

(async () => {
  const { version, bin } = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  const executableName = Object.keys(bin)[0];

  runJHipster({
    executableName,
    executableVersion: version,
    defaultCommand: 'ionic',
    devBlueprintPath,
    blueprints: {
      [packageFolderName]: version,
    },
    printBlueprintLogo: () => {
      console.log('===================== JHipster ionic =====================');
      console.log('');
    },
    lookups: [{ packagePaths: [packagePath], lookups: ['generators'] }],
  }).catch(done);
})();

process.on('unhandledRejection', up => {
  logger.error('Unhandled promise rejection at:');
  logger.fatal(up);
});
