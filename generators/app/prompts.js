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
const chalk = require('chalk');
const shelljs = require('shelljs');

module.exports = {
    confirmInstall,
    askForAppName,
    askForPath,
};

function confirmInstall(meta) {
    if (!meta && this.existingProject) return;

    const prompts = [
        {
            type: 'confirm',
            name: 'installIonic',
            message: 'Do you want to install Ionic for JHipster?',
            default: 'Yes'
        }
    ];

    if (meta) return prompts; // eslint-disable-line consistent-return

    const done = this.async();

    this.prompt(prompts).then((prompt) => {
        this.installIonic = prompt.installIonic;
        done();
    });
}

/**
 * Ask For Path
 */
function askForPath(meta) {
    if (!meta && this.existingProject) return;

    const done = this.async();
    const messageAskForPath = 'Enter the directory where your JHipster app is located:';
    const prompts = [{
        type: 'input',
        name: 'directoryPath',
        message: messageAskForPath,
        default: 'backend',
        validate: (input) => {
            const path = this.destinationPath(input);
            if (shelljs.test('-d', path)) {
                const appsFolders = getAppFolder.call(this, input);
                if (appsFolders.length === 0) {
                    return `No application found in ${path}`;
                }
                return true;
            }
            return `${path} is not a directory or doesn't exist`;
        }
    }];

    this.prompt(prompts).then((props) => {
        this.directoryPath = props.directoryPath;
        this.appFolder = getAppFolder.call(this, this.directoryPath);
        done();
    });
}

/**
 * Ask for App Name
 */
function askForAppName(meta) {
    if (!meta && this.existingProject) return;

    const done = this.async();
    const prompts = [{
        type: 'input',
        name: 'appName',
        message: 'What do you want to name your Ionic application?',
        default: 'ionic4j'
    }];

    this.prompt(prompts).then((props) => {
        this.ionicAppName = props.appName;
        done();
    });
}
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
