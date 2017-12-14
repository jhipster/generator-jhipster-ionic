/**
 * Copyright 2013-2017 the original author or authors from the JHipster project.
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
const writeFiles = require('./files').writeFiles;
const utils = require('generator-jhipster/generators/utils');
const BaseGenerator = require('generator-jhipster/generators/generator-base');

let useBlueprint;

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
        utils.copyObjectProps(this, this.options.context);
        const blueprint = this.config.get('blueprint');
        useBlueprint = this.composeBlueprint(blueprint, 'entity'); // use global variable since getters dont have access to instance property
    }

    get writing() {
        if (useBlueprint) return;
        return writeFiles();
    }

    end() {
        if (useBlueprint) return;
        this.log(chalk.bold.green('Entity generation completed. You may have to stop/start "ionic serve" to see your new entity.'));
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
    addEntityToModule(entityInstance, entityClass, entityAngularName, entityFolderName, entityFileName, enableTranslation) {
        // workaround for having multiple entries added
        if (!entityAngularName) {
            return;
        }
        const entityPagePath = 'src/pages/entities/entity.ts';
        try {
            const page = `{name: '${entityAngularName}', component: '${entityAngularName}Page'},`;
            utils.rewriteFile({
                file: entityPagePath,
                needle: 'jhipster-needle-add-entity-page',
                splicable: [
                    this.stripMargin(page)
                ]
            }, this);
        } catch (e) {
            this.log(`${chalk.yellow('\nUnable to find ') + entityPagePath + chalk.yellow(' or missing required jhipster-needle. Reference to ') + entityAngularName} ${chalk.yellow(`not added to ${entityPagePath}.\n`)}`);
            this.debug('Error:', e);
        }
    }
};
