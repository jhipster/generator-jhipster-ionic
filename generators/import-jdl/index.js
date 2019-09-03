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
const BaseBlueprintGenerator = require('generator-jhipster/generators/generator-base-blueprint');
const jhiCore = require('jhipster-core');
const { logger } = require('generator-jhipster/cli/utils');
const jhipsterUtils = require('generator-jhipster/generators/utils');
const fs = require('fs-extra');

/**
 * Imports the Applications and Entities defined in JDL
 * The app .yo-rc.json files and entity json files are written to disk
 */
function importJDL() {
  logger.info('The JDL is being parsed.');
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
    logger.debug(`importState exportedEntities: ${importState.exportedEntities.length}`);

    if (importState.exportedEntities.length > 0) {
      const entityNames = _.uniq(importState.exportedEntities.map(exportedEntity => exportedEntity.name)).join(', ');
      logger.info(`Found entities: ${chalk.yellow(entityNames)}.`);
    } else {
      logger.info(chalk.yellow('No change in entity configurations, no entities were updated.'));
    }
    logger.info('The JDL has been successfully parsed');
  } catch (error) {
    logger.debug('Error:', error);
    if (error) {
      const errorName = `${error.name}:` || '';
      const errorMessage = error.message || '';
      logger.log(chalk.red(`${errorName} ${errorMessage}`));
    }
    logger.error(`Error while parsing applications and entities from the JDL ${error}`, error);
  }
  return importState;
}

/**
 * Generate entities for the applications
 * @param {any} generator
 * @param {any} entity
 * @param {boolean} inFolder
 * @param {any} env
 * @param {boolean} shouldTriggerInstall
 * @param {function} forkProcess
 */
const generateEntityFiles = (generator, entity, inFolder, env, shouldTriggerInstall, forkProcess) => {
  const options = {
    ...generator.options,
    regenerate: true,
    'skip-install': true,
  };
  const command = `${CLI_NAME}:entity ${entity.name}`;
  if (inFolder) {
    /* Generating entities inside multiple apps */
    let previousEntity;
    const callGenerator = baseName => {
      logger.info(`Generating entities for application ${baseName} in a new parallel process`);
      const cwd = path.join(generator.pwd, baseName);
      logger.debug(`Child process will be triggered for ${runYeomanProcess} with cwd: ${cwd}`);

      const childProc = forkProcess(runYeomanProcess, [command, ...getOptionAsArgs(options, false, !options.interactive)], { cwd });
      childProc.on('exit', code => {
        logger.info(`Entity: child process exited with code ${code}`);
        generationCompletionState.exportedEntities[entity.name] = true;
      });
      previousEntity = entity.name;
    };
    const baseNames = entity.applications;
    baseNames.forEach(baseName => {
      if (generator.options.interactive) {
        waitUntil()
          .interval(500)
          .times(200) // approximate 2 minutes
          .condition(() => generationCompletionState.exportedEntities[previousEntity] || !previousEntity)
          .done(result => {
            logger.debug(`Result from waitUntil for application ${previousEntity} to finish: ${result}`);
            callGenerator(baseName);
          });
      } else {
        callGenerator(baseName);
      }
    });
  } else {
    /* Traditional entity only generation */
    env.run(
      command,
      {
        ...options,
        force: options.force || !options.interactive,
        'skip-install': !shouldTriggerInstall
      },
      done
    );
  }
};

/**
 * Check if NPM/Yarn install needs to be triggered. This will be done for the last entity.
 * @param {any} generator
 * @param {number} index
 */
const shouldTriggerInstall = (generator, index) =>
  index === generator.importState.exportedEntities.length - 1 &&
  !generator.options['skip-install'] &&
  !generator.skipClient &&
  !generator.options['json-only'];

class ImportJDL extends BaseBlueprintGenerator {
  constructor(jdlFiles, options) {
    super(jdlFiles, options);
    logger.info(`JDLProcessor started with jdlFiles: ${jdlFiles} and options: ${toString(options)}`);
    this.jdlFiles = jdlFiles;
    this.options = options;
    this.pwd = process.cwd();
  }

  get initializing() {
    this.configRootPath = fs.readJSONSync('.jhipster-ionic.json').directoryPath;
    logger.info(`this.configRootPath: ${this.configRootPath}`);
    const configuration = jhipsterUtils.getAllJhipsterConfig(null, true, this.configRootPath);
    this.applicationType = configuration.applicationType;
    this.baseName = configuration.baseName;
    this.prodDatabaseType = configuration.prodDatabaseType || this.options.db;
  }

  get install() {
    this.importState = importJDL.call(this);
  }

  generateEntities(env, forkProcess) {
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
      this.importState.exportedEntities.forEach((exportedEntity, i) => {
        generateEntityFiles(
          this,
          exportedEntity,
          this.importState.exportedApplications.length > 1,
          env,
          shouldTriggerInstall(this, i),
          forkProcess
        );
      });
    } catch (error) {
      logger.error(`Error while generating entities from the parsed JDL\n${error}`, error);
    }
  }
}

/**
 * Import-JDL sub generator
 * @param {any} args arguments passed for import-jdl
 * @param {any} options options passed from CLI
 * @param {any} env the yeoman environment
 * @param {function} forkProcess the method to use for process forking
 */
module.exports = (args, options, env, forkProcess = fork) => {
  logger.debug('cmd: import-jdl from ./import-jdl');
  logger.debug(`args: ${toString(args)}`);
  const jdlFiles = jhipsterUtils.getOptionsFromArgs(args);
  logger.info(chalk.yellow(`Executing import-jdl ${jdlFiles.join(' ')}`));
  logger.info(chalk.yellow(`Options: ${toString(options)}`));
  try {
    const jdlImporter = new ImportJDL(jdlFiles, options);
    jdlImporter.validate();
    jdlImporter.getConfig();
    jdlImporter.importJDL();
    jdlImporter.sendInsight();
    jdlImporter.generateEntities(env, forkProcess);
  } catch (e) {
    logger.error(`Error during import-jdl: ${e.message}`, e);
  }
};
