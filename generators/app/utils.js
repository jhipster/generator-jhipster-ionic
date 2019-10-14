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
const chalk = require('chalk');
const shelljs = require('shelljs');

module.exports = {
    getAppFolder
};

/**
 * Get App Folders
 * @param input path to join to destination path
 * @returns {Array} array of string representing app folders
 */
function getAppFolder(input) {
    const destinationPath = this.destinationPath(input);
    const appsFolders = [];

    if (shelljs.test('-f', `${destinationPath}/.yo-rc.json`)) {
        try {
            const fileData = this.fs.readJSON(`${destinationPath}/.yo-rc.json`);
            if (fileData['generator-jhipster'].baseName !== undefined) {
                appsFolders.push(destinationPath);
            }
        } catch (err) {
            this.log(chalk.red(`The .yo-rc.json in ${destinationPath} can't be read!`));
            this.debug('Error:', err);
        }
    }

    return appsFolders;
}
