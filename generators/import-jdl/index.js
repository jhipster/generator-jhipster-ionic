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
const pluralize = require('pluralize');
const jhipsterUtils = require('generator-jhipster/generators/utils');
const fs = require('fs-extra');

function importJDL() {
  logger.info('The JDL is being parsed...');

  const jdlImporter = new jhiCore.JDLImporter(this.jdlFiles, {
    databaseType: this.prodDatabaseType,
    applicationType: this.applicationType,
    applicationName: this.baseName
  });
  let importState = {
    exportedEntities: [],
    exportedApplications: [],
    exportedDeployments: []
  };
  try {
    importState = jdlImporter.import();
    if (importState.exportedEntities.length > 0) {
      const entityNames = _.uniq(importState.exportedEntities
        .map((exportedEntity) => exportedEntity.name))
        .join(', ');
      logger.info(`Found entities: ${chalk.yellow(entityNames)}.`);
    } else {
      logger.info(chalk.yellow('No change in entity configurations, no entities were updated.'));
    }
    logger.info('The JDL has been successfully parsed.');
  } catch (error) {
    logger.debug('Error:', error);
    if (error) {
      const errorName = `${error.name}:` || '';
      const errorMessage = error.message || '';
      logger.log(chalk.red(`${errorName} ${errorMessage}`));
    }
    logger.error(`Error while parsing entities from the JDL ${error}`, error);
  }
  return importState;
}

function generateEntityFiles(generator, entity) {
  callSubGenerator(generator, '..', 'entity', {
    force: true,
    debug: generator.options.debug,
    regenerate: true,
    'skip-install': true,
    arguments: entity.name
  });
}

function callSubGenerator(generator, subgenPath, name, args) {
  generator.composeWith(require.resolve(path.join(subgenPath, name)), args);
}

class ImportJDLGenerator extends BaseGenerator {
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

    try {
      this.configRootPath = fs.readJSONSync('.jhipster-ionic.json').directoryPath;
      const configuration = jhipsterUtils.getAllJhipsterConfig(null, true, this.configRootPath);
      this.applicationType = configuration.applicationType;
      this.baseName = configuration.baseName;
      this.prodDatabaseType = configuration.prodDatabaseType || this.options.db;

      this.importState = importJDL.call(this);
    } catch (error) {
      logger.info('File .jhipster-ionic.json not found. Please run this command in an Ionic project.');
      logger.error(error);
    }
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
        if (this.importState.exportedEntities.length === 0) {
          logger.debug('Entities not generated');
          return;
        }
        if (this.options['json-only']) {
          logger.info('Entity JSON files created. Entity generation skipped.');
          return;
        }
        try {
          logger.info(
            `Generating ${this.importState.exportedEntities.length} ` +
            `${pluralize('entity', this.importState.exportedEntities.length)}.`
          );
          this.importState.exportedEntities.forEach((exportedEntity) => {
            generateEntityFiles(this, exportedEntity);
          });
        } catch (error) {
          logger.error(`Error while generating entities from the parsed JDL\n${error}`, error);
        }
      }
    };
  }
}

module.exports = ImportJDLGenerator;
