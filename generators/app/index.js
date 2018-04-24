/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
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
const packagejs = require('../../package.json');
const jsonfile = require('jsonfile');
const semver = require('semver');
const shelljs = require('shelljs');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const modifyPackage = require('modify-package-dependencies');
const spawn = require('cross-spawn');
const fs = require('fs');
const constants = require('generator-jhipster/generators/generator-constants');

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);

        this.configOptions = {};
        // This adds support for a `--interactive` flag
        this.option('interactive', {
            desc: 'Don\'t prompt user when running ionic start',
            type: Boolean,
            defaults: true
        });

        // This adds support for a `--install` flag
        this.option('installDeps', {
            desc: 'Don\'t install dependencies when running ionic start',
            type: Boolean,
            defaults: true
        });

        this.interactive = this.options.interactive;
        this.installDeps = this.options.installDeps;
    }

    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    this.defaultApp = true;
                    this.interactive = false;
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                // this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.blue('Ionic')} Module for ${chalk.bold.green('J')}${chalk.bold.red('Hipster')}! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            }
        };
    }

    prompting() {
        const done = this.async();
        const messageAskForPath = 'Enter the directory where your JHipster app is located:';
        const prompts = [
            {
                type: 'input',
                name: 'appName',
                message: 'What do you want to name your Ionic application?',
                default: 'ionic4j'
            },
            {
                type: 'input',
                name: 'directoryPath',
                message: messageAskForPath,
                default: 'backend',
                validate: (input) => {
                    const path = this.destinationPath(input);
                    if (shelljs.test('-d', path)) {
                        const appsFolders = this.getAppFolder.call(this, input);
                        if (appsFolders.length === 0) {
                            return `No application found in ${path}`;
                        }
                        return true;
                    }
                    return `${path} is not a directory or doesn't exist`;
                }
            }];

        if (this.defaultApp) {
            this.ionicAppName = 'ionic4j';
            this.directoryPath = 'backend';
            done();
        } else {
            this.prompt(prompts).then((props) => {
                this.ionicAppName = props.appName;
                this.directoryPath = props.directoryPath;
                this.appFolder = this.getAppFolder.call(this, this.directoryPath);
                done();
            });
        }
    }

    writing() {
        const fromPath = `${this.directoryPath}/.yo-rc.json`;
        this.jhipsterAppConfig = this.fs.readJSON(fromPath)['generator-jhipster'];

        const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
        const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
        if (!currentJhipsterVersion.includes('5.0.0-beta') && !semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
            this.error(`\nYour backend uses an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
        }

        const applicationType = this.jhipsterAppConfig.applicationType;
        if (applicationType !== 'monolith' && applicationType !== 'gateway') {
            this.error(`\nYour backend project must be a monolith or a gateway to work with this module! Found application type: ${applicationType}.\n`);
        }

        const cmd = `ionic start ${this.ionicAppName} oktadeveloper/jhipster${(this.interactive) ? '' : ' --no-interactive'}`;
        this.log(`\nCreating Ionic app with command: ${chalk.green(`${cmd}`)}`);
        const params = ['start', this.ionicAppName, 'oktadeveloper/jhipster'];
        if (!this.interactive) {
            params.push('--no-interactive');
            params.push('--quiet');
        }
        if (!this.installDeps) {
            params.push('--no-deps');
            params.push('--no-git');
        }
        spawn.sync('ionic', params, {stdio: 'inherit'});
    }

    install() {
        // update package.json in Ionic app
        const done = this.async();
        const packagePath = `${this.ionicAppName}/package.json`;
        const packageJSON = this.fs.readJSON(packagePath);
        const devDependencies = ['generator-jhipster-ionic'];
        // todo: Don't install Inappbrowser if user said No to Cordova
        if (this.jhipsterAppConfig.authenticationType === 'oauth2') {
            // install the inappbrowser plugin for implicit flow
            this.log(`Adding Cordova's Inappbrowser plugin: ${chalk.green('ionic cordova plugin add cordova-plugin-inappbrowser')}`);
            if (this.installDeps) {
                shelljs.exec(`cd ${this.ionicAppName} && ionic cordova plugin add cordova-plugin-inappbrowser`);
            }
        }
        jsonfile.writeFileSync(packagePath, devDependencies);
        // todo: modifyPackage runs `npm install`; figure out a better way to bypass for tests
        if (this.installDeps) {
            modifyPackage.addDev(packageJSON, devDependencies)
                .then((dependencies) => {
                    jsonfile.writeFileSync(packagePath, dependencies);
                    const extraDeps = (this.jhipsterAppConfig.authenticationType === 'oauth2') ? ['angular-oauth2-oidc'] : [];
                    modifyPackage.add(packageJSON, extraDeps).then((giddyup) => {
                        jsonfile.writeFileSync(packagePath, giddyup);
                        this.log('Installing dependencies...');
                        shelljs.exec(`cd ${this.ionicAppName} && npm i --color=always`, {silent: false}, (code) => {
                            if (code === 0) {
                                done();
                            } else {
                                this.warning(`Failed to run ${chalk.yellow('npm install')} in ${this.ionicAppName}!`);
                                this.warning(`Please run it manually before running ${chalk.yellow('ionic serve')}`);
                            }
                        });
                    });
                });
        }

        // Copy server files to make API work with Ionic
        if (this.jhipsterAppConfig.authenticationType === 'oauth2') {
            this.log('Updating Java and TypeScript classes for OIDC...');
            this.packageName = this.jhipsterAppConfig.packageName;
            this.packageFolder = this.jhipsterAppConfig.packageFolder;

            const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
            const CLIENT_MAIN_SRC_DIR = `${this.ionicAppName}/src/`;
            const JAVA_DIR = `${constants.SERVER_MAIN_SRC_DIR}${this.packageFolder}/`;
            const applicationType = this.jhipsterAppConfig.applicationType;

            const securityConfigFile = (applicationType === 'monolith') ? 'SecurityConfiguration' : 'OAuth2SsoConfiguration';

            if (applicationType === 'monolith') {
                this.template(`${SERVER_MAIN_SRC_DIR}package/config/ResourceServerConfiguration.java`, `${this.directoryPath}/${JAVA_DIR}config/ResourceServerConfiguration.java`);
            } else {
                this.template(`${SERVER_MAIN_SRC_DIR}package/config/OAuth2SsoConfiguration.java`, `${this.directoryPath}/${JAVA_DIR}config/OAuth2SsoConfiguration.java`);
            }

            this.template(`${SERVER_MAIN_SRC_DIR}package/web/rest/AuthInfoResource.java`, `${this.directoryPath}/${JAVA_DIR}web/rest/AuthInfoResource.java`);
            // Update security configuration to allow /api/auth-info
            this.replaceContent(
                `${this.directoryPath}/${JAVA_DIR}config/${securityConfigFile}.java`,
                '("/api/profile-info")',
                '("/api/auth-info", "/api/profile-info")'
            );

            // Update Ionic files to work with OAuth
            this.template('src/app/app.component.ts', `${CLIENT_MAIN_SRC_DIR}app/app.component.ts`);
            this.template('src/app/app.module.ts', `${CLIENT_MAIN_SRC_DIR}app/app.module.ts`);
            this.template('src/pages/login/login.html', `${CLIENT_MAIN_SRC_DIR}pages/login/login.html`);
            this.template('src/pages/login/login.ts', `${CLIENT_MAIN_SRC_DIR}pages/login/login.ts`);
            this.template('src/pages/welcome/welcome.html', `${CLIENT_MAIN_SRC_DIR}pages/welcome/welcome.html`);
            this.template('src/providers/auth/auth-interceptor.ts', `${CLIENT_MAIN_SRC_DIR}providers/auth/auth-interceptor.ts`);
            this.template('src/providers/login/login.service.ts', `${CLIENT_MAIN_SRC_DIR}providers/login/login.service.ts`);
            this.template('src/providers/user/user.ts', `${CLIENT_MAIN_SRC_DIR}providers/user/user.ts`);

            // Delete files no longer used
            const filesToDelete = [
                `${CLIENT_MAIN_SRC_DIR}pages/signup`,
                `${CLIENT_MAIN_SRC_DIR}providers/auth/auth-jwt.service.ts`
            ];

            filesToDelete.forEach((path) => {
                if (path.endsWith('.ts') || path.endsWith('.html')) {
                    this.deleteFile(path);
                } else {
                    this.removeDirectory(path);
                }
            });
        }
        done();
    }

    deleteFile(path) {
        // check to see if the file exists before deleting
        try {
            fs.unlinkSync(path);
        } catch (e) {
            // file already deleted
        }
    }

    removeDirectory(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file, index) => {
                const curPath = `${path}/${file}`;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.removeDirectory(curPath);
                } else { // delete file
                    this.deleteFile(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    end() {
        this.log('\nHipster Ionic App created successfully! 🎉\n');
        // application-dev.yml has CORS enabled by default, so don't warn on install. Too noisy.
        /* const configPath = chalk.yellow(`${this.directoryPath}/src/main/resources/config/application.yml`);
        this.log(`Enable CORS in ${configPath}, and set the allowed-origins to allow Ionic in production.\n`);
        this.log(`${chalk.green('    cors:')}`);
        this.log(`${chalk.green('        allowed-origins: "http://localhost:8100"')}\n`); */
        this.log('Run the following commands (in separate terminal windows) to see everything working:\n');
        this.log(`${chalk.green(`    cd ${this.directoryPath} && ${this.jhipsterAppConfig.buildTool === 'maven' ? './mvnw' : './gradlew'}`)}`);
        this.log(`${chalk.green(`    cd ${this.ionicAppName} && ionic serve`)}\n`);

        let portWarning = `${chalk.red('WARNING:')} The emulator runs on port 8080, so you will need to change your `;
        portWarning += `backend to run on a different port (e.g., 8888) when running ${chalk.green('ionic cordova emulate')}. `;
        portWarning += 'Port 8888 is specified in the following files:\n\n';
        portWarning += chalk.yellow(`    ${this.directoryPath}/src/main/resources/config/application-dev.yml\n`);
        portWarning += chalk.yellow(`    ${this.directoryPath}/webpack/webpack.dev.js\n`);
        portWarning += chalk.yellow(`    ${this.ionicAppName}/src/providers/api/api.ts\n`);
        this.log(portWarning);
    }

    /**
     * Get App Folders
     * @param input path to join to destination path
     * @returns {Array} array of string representing app folders
     */
    getAppFolder(input) {
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
};
