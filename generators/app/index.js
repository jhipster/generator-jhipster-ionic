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
const spawn = require('cross-spawn');
const fs = require('fs');
const constants = require('generator-jhipster/generators/generator-constants');
const utils = require('./utils');

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
        this.jhipsterAppConfig = this.getAllJhipsterConfig();
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
            const appsFolders = utils.getAppFolder.call(this, input);
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
        done();
      });
    }
  }

  writing() {
    const fromPath = `${this.directoryPath}/.yo-rc.json`;
    this.jhipsterAppConfig = this.fs.readJSON(fromPath)['generator-jhipster'];

    const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
    const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
    if (currentJhipsterVersion !== undefined && !semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
      this.error(`\nYour backend uses an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
    }

    this.isIonicV3 = this._isIonicV3();
    if (this.isIonicV3) {
      this.log(`\n${chalk.bold.red('You are not using the latest version of Ionic. Run npm install -g ionic')}`);
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

  _isIonicV3() {
    const currentIonicVersion = shelljs.exec('ionic version --no-interactive', {silent: true}).stdout.replace(/\n/g, '');
    const minimumIonicVersion = '<4.0.0';

    return semver.satisfies(currentIonicVersion, minimumIonicVersion);
  }

  install() {
    // update package.json in Ionic app
    const done = this.async();
    const packagePath = `${this.ionicAppName}/package.json`;
    const packageJSON = this.fs.readJSON(packagePath);

    // add some branding 🤓
    packageJSON.author = 'Ionic Framework + JHipster';
    packageJSON.homepage = 'https://www.jhipster.tech';
    packageJSON.description = 'A hipster Ionic project, made with 💙 by @oktadev!';
    packageJSON.devDependencies['generator-jhipster-ionic'] = packagejs.version;
    jsonfile.writeFileSync(packagePath, packageJSON);

    if (this.jhipsterAppConfig.authenticationType === 'oauth2') {
      packageJSON.devDependencies['@oktadev/schematics'] = '0.8.0';
      jsonfile.writeFileSync(packagePath, packageJSON);
    }

    if (this.installDeps) {
      this.log('Installing dependencies...');
      shelljs.exec(`cd ${this.ionicAppName} && npm i --color=always`, {silent: false}, (code) => {
        if (code === 0) {
          done();
        } else {
          this.warning(`Failed to run ${chalk.yellow('npm install')} in ${this.ionicAppName}!`);
          this.warning(`Please run it manually before running ${chalk.yellow('ionic serve')}`);
        }
      });
    }

    // Copy server files to make API work with Ionic
    if (this.jhipsterAppConfig.authenticationType === 'oauth2') {
      this.log('Updating Java and TypeScript classes for OIDC...');
      this.packageName = this.jhipsterAppConfig.packageName;
      this.packageFolder = this.jhipsterAppConfig.packageFolder;

      if (this.installDeps) {
        shelljs.exec(`cd ${this.ionicAppName} && ng add @oktadev/schematics --configUri=http://localhost:8080/api/auth-info --issuer=null --clientId=null`, {silent: false}, (code) => {
          if (code === 0) {
            done();
          } else {
            this.warning(`Failed to run ${chalk.yellow('ng add @oktadev/schematics')} in ${this.ionicAppName}!`);
          }
        });
      }

      const CLIENT_MAIN_SRC_DIR = `${this.ionicAppName}/src/`;

      // Update Ionic files to work with JHipster
      this.template('src/app/app.component.ts', `${CLIENT_MAIN_SRC_DIR}app/app.component.ts`);
      this.template('src/app/app.component.spec.ts', `${CLIENT_MAIN_SRC_DIR}app/app.component.spec.ts`);
      this.template('src/app/app.module.ts', `${CLIENT_MAIN_SRC_DIR}app/app.module.ts`);
      this.template('src/app/app-routing.module.ts', `${CLIENT_MAIN_SRC_DIR}app/app-routing.module.ts`);
      this.template('src/app/interceptors/auth.interceptor.ts', `${CLIENT_MAIN_SRC_DIR}app/interceptors/auth.interceptor.ts`);
      this.template('src/app/pages/home/home.page.spec.ts', `${CLIENT_MAIN_SRC_DIR}app/pages/home/home.page.spec.ts`);
      this.template('src/app/pages/home/home.page.ts', `${CLIENT_MAIN_SRC_DIR}app/pages/home/home.page.ts`);
      this.template('src/app/pages/login/login.page.html', `${CLIENT_MAIN_SRC_DIR}app/pages/login/login.page.html`);
      this.template('src/app/pages/login/login.page.spec.ts', `${CLIENT_MAIN_SRC_DIR}app/pages/login/login.page.spec.ts`);
      this.template('src/app/pages/login/login.page.ts', `${CLIENT_MAIN_SRC_DIR}app/pages/login/login.page.ts`);
      this.template('src/app/pages/welcome/welcome.page.html', `${CLIENT_MAIN_SRC_DIR}app/pages/welcome/welcome.page.html`);
      this.template('src/app/pages/welcome/welcome.page.spec.ts', `${CLIENT_MAIN_SRC_DIR}app/pages/welcome/welcome.page.spec.ts`);
      this.template('src/app/pages/welcome/welcome.page.ts', `${CLIENT_MAIN_SRC_DIR}app/pages/welcome/welcome.page.ts`);
      this.template('src/app/services/auth/account.service.spec.ts', `${CLIENT_MAIN_SRC_DIR}app/services/auth/account.service.spec.ts`);
      this.template('src/app/services/auth/account.service.ts', `${CLIENT_MAIN_SRC_DIR}app/services/auth/account.service.ts`);
      this.template('src/app/services/auth/user-route-access.service.spec.ts', `${CLIENT_MAIN_SRC_DIR}app/services/auth/user-route-access.service.spec.ts`);
      this.template('src/app/services/auth/user-route-access.service.ts', `${CLIENT_MAIN_SRC_DIR}app/services/auth/user-route-access.service.ts`);
      this.template('src/app/services/login/login.service.spec.ts', `${CLIENT_MAIN_SRC_DIR}app/services/login/login.service.spec.ts`);
      this.template('src/app/services/login/login.service.ts', `${CLIENT_MAIN_SRC_DIR}app/services/login/login.service.ts`);

      // Delete files no longer used
      const filesToDelete = [
        `${CLIENT_MAIN_SRC_DIR}app/login`,
        `${CLIENT_MAIN_SRC_DIR}app/tab1`,
        `${CLIENT_MAIN_SRC_DIR}app/pages/signup`,
        `${CLIENT_MAIN_SRC_DIR}app/services/user`,
        `${CLIENT_MAIN_SRC_DIR}app/services/auth/auth.jwt.service.ts`,
        `${CLIENT_MAIN_SRC_DIR}app/services/auth/auth.jwt.service.spec.ts`,
      ];

      filesToDelete.forEach((path) => {
        if (path.endsWith('.ts') || path.endsWith('.html')) {
          this.deleteFile(path);
        } else {
          this.removeDirectory(path);
        }
      });
    }

    // Add e2e tests
    this.authenticationType = this.jhipsterAppConfig.authenticationType;
    this.template('e2e/pages/login.po.ts', `${this.ionicAppName}/e2e/pages/login.po.ts`);
    this.template('e2e/spec/login.e2e-spec.ts', `${this.ionicAppName}/e2e/spec/login.e2e-spec.ts`);

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
    this.log('Ionic for JHipster App created successfully! 🎉\n');
    this.log('Run the following commands (in separate terminal windows) to see everything working:\n');
    this.log(`${chalk.green(`    cd ${this.directoryPath} && ${this.jhipsterAppConfig.buildTool === 'maven' ? './mvnw' : './gradlew'}`)}`);
    this.log(`${chalk.green(`    cd ${this.ionicAppName} && ionic serve`)}\n`);
  }
};
