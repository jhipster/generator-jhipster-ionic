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
const prompts = require('./prompts');

let skipPrompt = false;

class EntityGenerator extends BaseEntityGenerator {
  constructor(args, opts) {
    const suppressWarning = { 'from-cli': true };
    super(args, { ...opts, ...suppressWarning });
    skipPrompt = opts['skip-prompt'];
  }

  get initializing() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    // return super._initializing();
    const phaseFromJHipster = super._initializing();
    const myCustomPhaseSteps = {
      loadConfig() {

        this.context.genListPage = true; // this.options.list;
        this.context.genEditPage = true; // this.options.edit;
        this.context.genInlinePage = false; // this.options.inline;
        this.context.TopClass = 'TENANT'; // null -> queryByActive, 'TENANT' -> queryByTENANT, 'DOMAIN'  -> queryByDOMAIN

        this.configRootPath = this.options.configRootPath = this.fs.readJSON('.jhipster-ionic.json').directoryPath;
      }
    };
    return Object.assign(myCustomPhaseSteps, phaseFromJHipster);
  }


  get prompting() {

    // Here we are not overriding this phase and hence its being handled by JHipster
    // This adds support for `--list` flag -> generates list Page
    // this.option('list', {
    //     desc: 'Generte list Pages',
    //     type: String
    // });

    // // This adds support for `--edit` flag -> generates Edit Page
    // this.option('edit', {
    //     desc: 'Generte edit Page',
    //     type: String
    // });

    // // This adds support for `--inline` flag -> generating Inline Page
    // this.option('inline', {
    //     desc: 'Generte inline Page',
    //     type: String
    // });
    // return super._prompting();
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

  get default() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._default();
  }

  get install() {
    return {
      composeClient() {
        const context = this.context;

        const entityClientDirectory = context.isIonicV3 ? '../entity-client' : '../entity-client4';

        this.composeWith(require.resolve(entityClientDirectory), {
          context,
          'skip-install': context.options['skip-install'],
          'from-cli': true,
          force: context.options.force,
          debug: context.isDebugEnabled
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
