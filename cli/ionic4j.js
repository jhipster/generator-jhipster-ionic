#!/usr/bin/env node
/**
 * Copyright 2019-Present the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = require('path');
const { YeomanCommand } = require('yeoman-environment/lib/util/command');
const Env = require('yeoman-environment');
const packageJson = require('../package.json');

const program = new YeomanCommand();

program
  .version(packageJson.version)
  .allowExcessArguments(false)
  .option('--force-insight', 'Force insight')
  .option('--no-insight', 'Disable insight')
  .once('yeoman:environment', (env) => {
    const baseDir = path.join(__dirname, '..');
    // Register jhipster generators.
    env.lookup({ npmPaths: [path.join(baseDir, '..', 'node_modules'), path.join(baseDir, 'node_modules')] });
    env.lookup({ packagePaths: [baseDir] });
  });

Env.addEnvironmentOptions(program);

Env.prepareGeneratorCommand(
  program.command('app', { isDefault: true }).description('Create a Ionic application (default)'),
  require('../generators/app'),
  'jhipster-ionic:app'
);

Env.prepareGeneratorCommand(
  program.command('import-jdl').description('Import jdl file'),
  require('../generators/import-jdl'),
  'jhipster-ionic:import-jdl'
);

program.parseAsync(process.argv);
