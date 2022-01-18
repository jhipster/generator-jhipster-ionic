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
const BaseEntityGenerator = require('generator-jhipster/generators/entity');
const fs = require('fs-extra');

const prompts = require('./prompts');
const baseMixin = require('../generator-base-mixin');

let skipPrompt = false;

class EntityGenerator extends baseMixin(BaseEntityGenerator) {
  constructor(args, opts) {
    super(args, opts);

    skipPrompt = this.options.skipPrompt;

    if (this.options.help) {
      return;
    }

    try {
      this.configRootPath = fs.readJSONSync('.jhipster-ionic.json').directoryPath;
      const yoRc = fs.readJSONSync(`${this.configRootPath}/.yo-rc.json`);
      this.jhipsterConfig = yoRc ? yoRc['generator-jhipster'] : {};
    } catch (error) {
      this.log('File .jhipster-ionic.json not found. Please run this command in an Ionic project.');
      throw error;
    }
  }

  get initializing() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._initializing();
  }

  get prompting() {
    if (skipPrompt) {
      return super._prompting();
    }

    const entityPrompts = super._prompting();
    return {
      askForBackendJson: prompts.askForBackendJson,
      ...entityPrompts
    };
  }

  get configuring() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._configuring();
  }

  get composing() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return {};
  }

  get loading() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return { ...super._loading(), composing: undefined };
  }

  get preparing() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._preparing();
  }

  get preparingFields() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._preparingFields();
  }

  get preparingRelationships() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._preparingRelationships();
  }

  get default() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._default();
  }

  get install() {
    return {
      composeClient() {
        const context = this.context;

        const entityClientDirectory = '../entity-client';

        this.composeWith(require.resolve(entityClientDirectory), {
          context,
          skipInstall: this.options.skipInstall,
          fromCli: true,
          force: this.options.force,
          debug: this.configOptions.isDebugEnabled
        });
      }
    };
  }

  get end() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._end();
  }
}

module.exports = EntityGenerator;
