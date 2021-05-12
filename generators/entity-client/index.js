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
/* eslint-disable consistent-return */
const chalk = require('chalk');
const _ = require('lodash');
const utils = require('generator-jhipster/generators/utils');
const BaseGenerator = require('generator-jhipster/generators/entity-client');
const fs = require('fs-extra');

const writeFiles = require('./files').writeFiles;
const baseMixin = require('../generator-base-mixin');

let useBlueprint;

module.exports = class extends baseMixin(BaseGenerator) {
  constructor(args, opts) {
    super(args, opts);

    if (this.options.help) {
      return;
    }

    // Load readonly jhipsterConfig
    try {
      this.configRootPath = fs.readJSONSync('.jhipster-ionic.json').directoryPath;
      const yoRc = fs.readJSONSync(`${this.configRootPath}/.yo-rc.json`);
      this.jhipsterConfig = yoRc ? yoRc['generator-jhipster'] : {};
    } catch (error) {
      this.log('File .jhipster-ionic.json not found. Please run this command in an Ionic project.');
      throw error;
    }
  }

  get composing() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return {};
  }

  get loading() {
    // Here we are not overriding this phase and hence its being handled by JHipster
    return super._loading();
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

  get writing() {
    if (useBlueprint) return;
    return writeFiles();
  }

  end() {
    if (useBlueprint) return;
    this.log(chalk.bold.green('\nEntity generation complete!'));
  }

  /**
   * Add a new entity in the TS modules file.
   *
   * @param {string} entityInstance - Entity Instance
   * @param {string} entityClass - Entity Class
   * @param {string} entityAngularName - Entity Angular Name
   * @param {string} entityFolderName - Entity Folder Name
   * @param {string} entityFileName - Entity File Name
   * @param {boolean} enableTranslation - If translations are enabled or not
   */
  _addEntityToModule(entityInstance, entityClass, entityAngularName, entityFolderName, entityFileName, enableTranslation) {
    // workaround method being called on initialization
    if (!entityAngularName) {
      return;
    }
    const entityPagePath = 'src/app/pages/entities/entities.page.ts';
    try {
      const isSpecificEntityAlreadyGenerated = utils.checkStringInFile(entityPagePath, `route: '${entityFileName}'`, this);

      if (!isSpecificEntityAlreadyGenerated) {
        const isAnyEntityAlreadyGenerated = utils.checkStringInFile(entityPagePath, 'route:', this);
        const pageEntry = `{ name: '${entityAngularName}', component: '${entityAngularName}Page', route: '${entityFileName}' },`;
        utils.rewriteFile(
          {
            file: entityPagePath,
            needle: 'jhipster-needle-add-entity-page',
            splicable: [this.stripMargin(pageEntry)]
          },
          this
        );
      }
    } catch (e) {
      this.log(
        `${
          chalk.yellow('\nUnable to find ') +
          entityPagePath +
          chalk.yellow(' or missing required jhipster-needle. Reference to ') +
          entityAngularName
        } ${chalk.yellow(`not added to ${entityPagePath}.\n`)}`
      );
      this.debug('Error:', e);
    }
  }

  /**
   * Add a new route in the TS modules file.
   *
   * @param {string} entityInstance - Entity Instance
   * @param {string} entityClass - Entity Class
   * @param {string} entityAngularName - Entity Angular Name
   * @param {string} entityFolderName - Entity Folder Name
   * @param {string} entityFileName - Entity File Name
   * @param {boolean} enableTranslation - If translations are enabled or not
   */
  _addEntityRouteToModule(entityInstance, entityClass, entityAngularName, entityFolderName, entityFileName, enableTranslation) {
    // workaround method being called on initialization
    if (!entityAngularName) {
      return;
    }
    const entityPagePath = 'src/app/pages/entities/entities.module.ts';
    try {
      const isSpecificEntityAlreadyGenerated = utils.checkStringInFile(entityPagePath, `path: '${entityFileName}'`, this);
      if (!isSpecificEntityAlreadyGenerated) {
        const route = `| {
                    |    path: '${entityFileName}',
                    |    loadChildren: './${entityFolderName}/${entityFileName}.module#${entityAngularName}PageModule'
                    |  },`;
        utils.rewriteFile(
          {
            file: entityPagePath,
            needle: 'jhipster-needle-add-entity-route',
            splicable: [this.stripMargin(route)]
          },
          this
        );
      }
    } catch (e) {
      this.log(
        `${
          chalk.yellow('\nUnable to find ') +
          entityPagePath +
          chalk.yellow(' or missing required jhipster-needle. Reference to ') +
          entityAngularName
        } ${chalk.yellow(`not added to ${entityPagePath}.\n`)}`
      );
      this.debug('Error:', e);
    }
  }

  /**
   * Generate Entity Queries for Ionic Providers
   *
   * @param {Array|Object} relationships - array of relationships
   * @param {string} entityInstance - entity instance
   * @param {string} dto - dto
   * @returns {{queries: Array, variables: Array, hasManyToMany: boolean}}
   */
  _generateEntityQueries(relationships, entityInstance, dto) {
    // workaround method being called on initialization
    if (!relationships) {
      return;
    }
    const queries = [];
    const variables = [];
    let hasManyToMany = false;
    relationships.forEach((relationship) => {
      let query;
      let variableName;
      hasManyToMany = hasManyToMany || relationship.relationshipType === 'many-to-many';
      if (relationship.relationshipType === 'one-to-one' && relationship.ownerSide === true && relationship.otherEntityName !== 'user') {
        variableName = _.camelCase(relationship.otherEntityNameCapitalizedPlural);
        if (variableName === entityInstance) {
          variableName += 'Collection';
        }
        const relationshipFieldName = `this.${entityInstance}.${relationship.relationshipFieldName}`;
        const relationshipFieldNameIdCheck =
          dto === 'no' ? `!${relationshipFieldName} || !${relationshipFieldName}.id` : `!${relationshipFieldName}Id`;

        query = `this.${relationship.otherEntityName}Service
            .query({filter: '${relationship.otherEntityRelationshipName.toLowerCase()}-is-null'})
            .subscribe(data => {
                if (${relationshipFieldNameIdCheck}) {
                    this.${variableName} = data.body;
                } else {
                    this.${relationship.otherEntityName}Service
                        .find(${relationshipFieldName}${dto === 'no' ? '.id' : 'Id'})
                        .subscribe((subData: HttpResponse<${relationship.otherEntityAngularName}>) => {
                            this.${variableName} = [subData.body].concat(subData.body);
                        }, (error) => this.onError(error));
                }
            }, (error) => this.onError(error));`;
      } else if (relationship.relationshipType !== 'one-to-many') {
        variableName = _.camelCase(relationship.otherEntityNameCapitalizedPlural);
        if (variableName === entityInstance) {
          variableName += 'Collection';
        }
        query = `this.${relationship.otherEntityName}Service.query()
            .subscribe(data => { this.${variableName} = data.body; }, (error) => this.onError(error));`;
      }
      if (variableName && !queries.includes(query)) {
        queries.push(query);
        variables.push(`${variableName}: ${relationship.otherEntityAngularName}[];`);
      }
    });
    return {
      queries,
      variables,
      hasManyToMany
    };
  }
};
