/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
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

class EntityGenerator extends BaseEntityGenerator {
  constructor(args, opts) {
    const suppressWarning = {'from-cli': true};
    super(args, {...opts, ...suppressWarning});
  }

  get initializing() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    // return super._initializing();
    const phaseFromJHipster = super._initializing();
    const myCustomPhaseSteps = {
      loadConfig() {
        this.configRootPath = this.options.configRootPath = this.fs.readJSON('.jhipster-ionic.json').directoryPath;
      }
    };
    return Object.assign(myCustomPhaseSteps, phaseFromJHipster);
  }

  get prompting() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._prompting();
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
        if (context.skipClient) return;

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
