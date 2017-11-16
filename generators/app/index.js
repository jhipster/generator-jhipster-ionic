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
const packagejs = require('../../package.json');
const jsonfile = require('jsonfile');
const semver = require('semver');
const shelljs = require('shelljs');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const prompts = require('./prompts');
const modifyPackage = require('modify-package-dependencies');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                // this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.blue('Ionic JHipster')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            }
        };
    }

    get prompting() {
        return {
            askForProjectName: prompts.askForAppName,
            askForPath: prompts.askForPath
        };
    }

    get writing() {
        const fromPath = `${this.directoryPath}/.yo-rc.json`;
        this.jhipsterAppConfig = this.fs.readJSON(fromPath)['generator-jhipster'];

        const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
        const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
        if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
            this.error(`\nYour backend uses an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
        }

        const done = this.async();
        if (shelljs.test('-d', this.ionicAppName)) {
            // todo: prompt to override
            this.error(`Directory ${chalk.bold.blue(this.ionicAppName)} already exists, please remove it to continue.`);
        } else {
            this.log(`\nCreating Ionic app with command: ${chalk.yellow(`ionic start ${this.ionicAppName} super`)}`);
            shelljs.exec(`ionic start ${this.ionicAppName} oktadeveloper/jhipster --no-link --no-deps --color=always`, { silent: false }, (code, stdout) => {
                if (stdout.indexOf('ionic: command not found') > -1) {
                    let msg = 'You need to install Ionic before generating an app with this module.';
                    msg += `\nPlease run ${chalk.yellow('npm install -g ionic cordova')}, then try again.`;
                    this.error(msg);
                }
                if (code !== 0) {
                    let msg = 'Ionic app creation failed. Please create an issue for this on GitHub.\n';
                    msg += 'https://github.com/oktadeveloper/generator-jhipster-ionic/issues';
                    this.error(msg);
                }
                done();
            });
        }
    }

    install() {
        // update package.json in Ionic app
        const done = this.async();
        const packagePath = `${this.ionicAppName}/package.json`;
        const packageJSON = this.fs.readJSON(packagePath);
        const dependencies = ['generator-jhipster-ionic'];
        if (this.jhipsterAppConfig.authenticationType === 'oauth2') {
            // ionic cordova plugin add cordova-plugin-inappbrowser
            dependencies.push('cordova-plugin-inappbrowser@1.7.1');
        }
        modifyPackage.addDev(packageJSON, dependencies)
            .then((dependencies) => {
                jsonfile.writeFileSync(packagePath, dependencies);

                this.log('\nInstalling dependencies...');
                shelljs.exec(`cd ${this.ionicAppName} && npm i --color=always`, { silent: false }, (code) => {
                    if (code === 0) {
                        done();
                    } else {
                        this.warning(`Failed to run ${chalk.yellow('npm install')} in ${this.ionicAppName}!`);
                        this.warning(`Please run it manually before running ${chalk.yellow('ionic serve')}`);
                    }
                });
            });
    }

    end() {
        this.log('\nApp created successfully! 🎉\n');
        const configPath = chalk.yellow(`${this.directoryPath}/src/main/resources/config/application.yml`);
        this.log(`Enable CORS in ${configPath}, and set the allowed-origins:\n`);
        this.log(`${chalk.green('    cors:')}`);
        this.log(`${chalk.green('        allowed-origins: "http://localhost:8100"')}\n`);
        this.log('Then run the following commands (in separate terminals) to see it working:\n');
        this.log(`${chalk.green(`    cd ${this.directoryPath} && ${this.jhipsterAppConfig.buildTool === 'maven' ? './mvnw' : './gradlew'}`)}`);
        this.log(`${chalk.green(`    cd ${this.ionicAppName} && ionic serve`)}\n`);
    }
};
