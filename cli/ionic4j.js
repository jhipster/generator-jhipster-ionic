#!/usr/bin/env node
/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
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
const spawn = require('cross-spawn');

let commands = ['jhipster-ionic'];

// ionic4j entity $name
if (process.argv[2] === 'entity') {
  commands = [commands[0].replace('ionic', 'ionic:entity')];
  commands[1] = process.argv[3];
}

// allow ionic4j import-jdl $file
if (process.argv[2] === 'import-jdl') {
  commands = [commands[0].replace('ionic', 'ionic:import-jdl')];
  commands[1] = process.argv[3];
}

// Path to the yo cli script in generator-jhipster-ionic's node_modules
const yoInternalCliPath = `${__dirname}/../node_modules/yo/lib/cli.js`;

spawn.sync(yoInternalCliPath, commands, { stdio: 'inherit' });
