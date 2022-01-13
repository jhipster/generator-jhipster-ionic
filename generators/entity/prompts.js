/**
 * Copyright 2019-Present the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
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
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');
const shelljs = require('shelljs');

module.exports = {
  askForBackendJson
};

function askForBackendJson() {
  const context = this.context;
  if (context.useConfigurationFile) {
    return;
  }

  const done = this.async();

  const prompts = [
    {
      type: 'confirm',
      name: 'useBackendJson',
      message: 'Do you want to generate this entity from an existing app?',
      default: true
    },
    {
      when: (response) => response.useBackendJson === true,
      type: 'input',
      name: 'backendPath',
      message: "Enter the path to your app's root directory:",
      store: true,
      validate: (input) => {
        let fromPath = '';
        if (path.isAbsolute(input)) {
          fromPath = `${input}/${context.filename}`;
        } else {
          fromPath = this.destinationPath(`${input}/${context.filename}`);
        }

        if (shelljs.test('-f', fromPath)) {
          return true;
        }
        return `${context.filename} not found in ${input}/`;
      }
    }
  ];

  this.prompt(prompts).then((props) => {
    if (props.backendPath) {
      this.log(chalk.green(`\nFound the ${context.filename} configuration file, entity can be automatically generated!\n`));
      if (path.isAbsolute(props.backendPath)) {
        context.backendPath = props.backendPath;
      } else {
        context.backendPath = path.resolve(props.backendPath);
      }
      context.fromPath = `${context.backendPath}/${context.jhipsterConfigDirectory}/${context.entityNameCapitalized}.json`;
      context.useConfigurationFile = true;
      context.useBackendJson = true;
      this.loadEntityJson();

      // this.loadEntityJson() has a gateway check, which won't work here, so simplify
      if (context.useMicroserviceJson) {
        context.microserviceName = context.fileData.microserviceName;
        if (!context.microserviceName) {
          this.error(chalk.red('Microservice name for the entity is not found. Entity cannot be generated!'));
        }
        context.microserviceAppName = this.getMicroserviceAppName(context.microserviceName);
        context.skipServer = true;
      }
    }
    done();
  });
}
