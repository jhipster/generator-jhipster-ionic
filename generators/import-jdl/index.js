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
const _ = require('lodash');
const path = require('path');
const shelljs = require('shelljs');
const chalk = require('chalk');
const jhiCore = require('jhipster-core');
const { logger } = require('generator-jhipster/cli/utils');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const packagejs = require('../../package.json');
const jhipsterUtils = require('generator-jhipster/generators/utils');
const fs = require('fs-extra');

class ImporterGenerator extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('jdlFiles', { type: Array, required: true });
    this.jdlFiles = this.options.jdlFiles;

    // This adds support for a `--json-only` flag
    this.option('json-only', {
      desc: 'Generate only the JSON files and skip entity regeneration',
      type: Boolean,
      defaults: false
    });

    this.configRootPath = fs.readJSONSync('.jhipster-ionic.json').directoryPath;
    const configuration = jhipsterUtils.getAllJhipsterConfig(null, true, this.configRootPath);
    this.applicationType = configuration.applicationType;
    this.baseName = configuration.baseName;
    this.prodDatabaseType = configuration.prodDatabaseType || this.options.db;

    this.importState = importJDL.call(this);
  }
}

function importJDL() {
  this.log('The JDL is being parsed.');
  const jdlImporter = new jhiCore.JDLImporter(this.jdlFiles, {
    databaseType: this.prodDatabaseType,
    applicationType: this.applicationType,
    applicationName: this.baseName
  });
  let importState = {
    exportedEntities: []
  };
  try {
    importState = jdlImporter.import();
    if (importState.exportedEntities.length > 0) {
      const entityNames = _.uniq(importState.exportedEntities
        .map(exportedEntity => exportedEntity.name))
        .join(', ');
      this.log(`Found entities: ${chalk.yellow(entityNames)}.`);
    } else {
      this.log(chalk.yellow('No change in entity configurations, no entities were updated.'));
    }
    this.log('The JDL has been successfully parsed');
  } catch (error) {
    this.debug('Error:', error);
    if (error) {
      const errorName = `${error.name}:` || '';
      const errorMessage = error.message || '';
      this.log(chalk.red(`${errorName} ${errorMessage}`));
    }
    this.error(`Error while parsing applications and entities from the JDL ${error}`);
  }
  return importState;
}

module.exports = class extends ImporterGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.entitiesLeftToGenerate = [];
  }

  get initializing() {
    return {
      validate() {
        if (this.jdlFiles) {
          this.jdlFiles.forEach((key) => {
            if (!shelljs.test('-f', key)) {
              this.env.error(chalk.red(`\nCould not find ${key}, make sure the path is correct.\n`));
            }
          });
        }
      }
    };
  }

  get writing() {
    return {
      generateEntities() {
        if (this.importState.exportedEntities.length === 0 || this.importState.exportedApplications.length !== 0) {
          return;
        }
        if (this.options['json-only']) {
          this.log('Entity JSON files created. Entity generation skipped.');
          return;
        }
        try {
          this.importState.exportedEntities.forEach((exportedEntity) => {
            if (this.importState.exportedApplications.length === 0
              || this.importState.exportedApplications.length === 1) {
              //this.log(`Generating ${this.importState.exportedEntities.length} `
              //  + `entit${this.importState.exportedEntities.length === 1 ? 'y' : 'ies'}.`);
              generateEntityFiles(this, exportedEntity);
            } else {
              // sub-folder generation, not yet handled
              this.entitiesLeftToGenerate.push(exportedEntity.name);
            }
          });
        } catch (error) {
          this.error(`Error while generating entities from the parsed JDL\n${error}`);
        }
      }
    };
  }

  end() {
    if (this.entitiesLeftToGenerate.length !== 0) {
      this.info(`Here are the entity names to generate manually: ${_.uniq(this.entitiesLeftToGenerate).join(', ')}`);
    }
  }
};

function generateEntityFiles(generator, entity) {
  callSubGenerator(generator, '..', 'entity', {
    force: generator.options.force,
    debug: generator.options.debug,
    regenerate: true,
    'skip-install': true,
    'skip-client': entity.skipClient,
    'skip-server': entity.skipServer,
    'no-fluent-methods': entity.noFluentMethod,
    'skip-user-management': entity.skipUserManagement,
    'skip-ui-grouping': generator.options['skip-ui-grouping'],
    arguments: [entity.name]
  });
}

function callSubGenerator(generator, subgenPath, name, args) {
  console.log('generator', generator)
  console.log('subgenPath', subgenPath)
  console.log('name', name)
  console.log('args', args)
  generator.composeWith(require.resolve(path.join(subgenPath, name)), args);
}
