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

const path = require('path');
const chalk = require('chalk');
const jsonfile = require('jsonfile');
const semver = require('semver');
const shelljs = require('shelljs');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const spawn = require('cross-spawn');
const fs = require('fs');
const packagejs = require('../../package.json');
const utils = require('./utils');
const baseMixin = require('../generator-base-mixin');

module.exports = class extends baseMixin(BaseGenerator) {
  constructor(args, opts) {
    super(args, opts);

    // This adds support for a `--interactive` flag
    this.option('interactive', {
      desc: "Don't prompt user when running ionic start",
      type: Boolean,
      defaults: false
    });

    // This adds support for a `--install` flag
    this.option('installDeps', {
      desc: "Don't install dependencies when running ionic start",
      type: Boolean,
      defaults: true
    });

    if (this.options.help) {
      return;
    }

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
        this.jhipsterAppConfig = this.config;
      },
      displayLogo() {
        // Have Yeoman greet the user.
        this.log(
          `\nWelcome to the ${chalk.bold.blue('Ionic')} Module for ${chalk.bold.green('J')}${chalk.bold.red('Hipster')}! ${chalk.yellow(
            `v${packagejs.version}\n`
          )}`
        );
      }
    };
  }

  async prompting() {
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
      }
    ];
    if (this.defaultApp) {
      this.ionicAppName = 'ionic4j';
      this.directoryPath = path.resolve('backend');
    } else {
      const answers = await this.prompt(prompts);
      this.ionicAppName = answers.appName;
      this.directoryPath = path.resolve(answers.directoryPath);
    }
  }

  get default() {
    return {
      forceOverwrite() {
        // force overwriting of files since prompting will confuse developers on initial install
        const conflicter = this.conflicter || this.env.conflicter;
        if (conflicter) {
          conflicter.force = true;
        } else {
          // yeoman-environment@3 conflicter is not instantiated yet.
          this.env.options.force = true;
        }
      }
    };
  }

  writing() {
    const fromPath = `${this.directoryPath}/.yo-rc.json`;
    this.jhipsterAppConfig = this.fs.readJSON(fromPath)['generator-jhipster'];

    const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
    const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
    if (currentJhipsterVersion !== undefined && !semver.satisfies(semver.coerce(currentJhipsterVersion), minimumJhipsterVersion)) {
      this.error(
        `\nYour backend uses an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`
      );
    }

    const applicationType = this.jhipsterAppConfig.applicationType;
    if (applicationType !== 'monolith' && applicationType !== 'gateway') {
      this.error(
        `\nYour backend project must be a monolith or a gateway to work with this module! Found application type: ${applicationType}.\n`
      );
    }

    const params = ['start', this.ionicAppName, 'oktadeveloper/jhipster'];
    params.push('--type');
    params.push('angular');
    params.push('--capacitor');
    if (!this.interactive) {
      params.push('--no-interactive');
      params.push('--quiet');
    }
    if (!this.installDeps) {
      params.push('--no-deps');
      params.push('--no-git');
    }

    this.log(`\nCreating Ionic app with command: ${chalk.green(`ionic ${params.join(' ')}`)}`);
    spawn.sync('ionic', params, { stdio: 'inherit' });

    const config = {
      ionicAppName: this.ionicAppName,
      directoryPath: this.directoryPath
    };

    const configFile = path.join(this.ionicAppName, '.jhipster-ionic.json');
    if (!fs.existsSync(this.ionicAppName)) {
      fs.mkdirSync(this.ionicAppName);
    }
    jsonfile.writeFileSync(configFile, config);
  }

  install() {
    // update package.json in Ionic app
    const done = this.async();
    const packagePath = `${this.ionicAppName}/package.json`;
    const packageJSON = this.fs.readJSON(packagePath) || { devDependencies: [], dependencies: [], scripts: {} };
    const CLIENT_MAIN_SRC_DIR = `${this.ionicAppName}/src/`;

    // add some branding 🤓
    packageJSON.author = 'Ionic Framework + JHipster';
    packageJSON.homepage = 'https://www.jhipster.tech';
    packageJSON.description = 'A hipster Ionic project, made with 💙 by @oktadev!';
    packageJSON.devDependencies['generator-jhipster-ionic'] = packagejs.version;

    if (this.jhipsterAppConfig.authenticationType === 'oauth2') {
      // add @ionic/storage and @ionic/storage-angular
      packageJSON.dependencies['@ionic/storage'] = '^3.0.6';
      packageJSON.dependencies['@ionic/storage-angular'] = '^3.0.6';
      // update jest config to ignore more patterns
      packageJSON.jest.transformIgnorePatterns = [
        'node_modules/(?!@ngrx|@ionic-native|@ionic|ionic-appauth|capacitor-secure-storage-plugin)'
      ];
      // fix Cannot find module '@ionic/storage' from 'node_modules/@ionic/storage-angular/bundles/ionic-storage-angular.umd.js'
      packageJSON.jest.moduleNameMapper = {
        '^@ionic/storage$': '<rootDir>/node_modules/@ionic/storage/dist/ionic-storage.cjs.js'
      };
    }

    // add prettier script
    packageJSON.scripts.prettier = 'prettier --write "{,e2e/**/,src/**/}*.{js,json,html,md,ts,css,scss,yml}" --loglevel silent';
    jsonfile.writeFileSync(packagePath, packageJSON);

    if (this.jhipsterAppConfig.authenticationType === 'oauth2') {
      this.packageName = this.jhipsterAppConfig.packageName;
      this.packageFolder = this.jhipsterAppConfig.packageFolder;

      let installAuthCmd;
      const params = '--configUri=auth-info --issuer=http://localhost:9080/auth/realms/jhipster --clientId=web_app';
      const schematicsVersion = packagejs.devDependencies['@oktadev/schematics'];

      // use `schematics` when testing and expect it to be installed
      if (this.installDeps) {
        installAuthCmd = `npx ng add @oktadev/schematics@${schematicsVersion} ${params}`;
      } else {
        packageJSON.devDependencies['@oktadev/schematics'] = schematicsVersion;
        jsonfile.writeFileSync(packagePath, packageJSON);
        installAuthCmd = `schematics @oktadev/schematics:add-auth ${params} --skipPackageJson=true`;
      }

      if (shelljs.exec(`cd ${this.ionicAppName} && ${installAuthCmd}`).code !== 0) {
        this.error(installAuthCmd);
        shelljs.exit(1);
      }

      // fix paths for login.module and tabs.module
      const tsConfigPath = `${this.ionicAppName}/tsconfig.app.json`;
      const tsConfig = this.fs.readJSON(tsConfigPath) || {};
      const tsConfigJSON = JSON.stringify(tsConfig).replace('login/', 'pages/login/').replace('tabs/', 'pages/tabs/');
      jsonfile.writeFileSync(tsConfigPath, JSON.parse(tsConfigJSON));

      this.log('Updating Ionic AppAuth to work with JHipster...');

      // Update Ionic files to work with JHipster
      this.template('src/app/app.component.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/app.component.ts`);
      this.template('src/app/app.component.spec.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/app.component.spec.ts`);
      this.template('src/app/app.module.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/app.module.ts`);
      this.template('src/app/app-routing.module.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/app-routing.module.ts`);
      this.template('src/app/interceptors/auth.interceptor.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/interceptors/auth.interceptor.ts`);
      this.template('src/app/pages/home/home.page.spec.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/home/home.page.spec.ts`);
      this.template('src/app/pages/home/home.page.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/home/home.page.ts`);
      this.template('src/app/pages/login/login.page.html.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/login/login.page.html`);
      this.template('src/app/pages/login/login.page.spec.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/login/login.page.spec.ts`);
      this.template('src/app/pages/login/login.page.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/login/login.page.ts`);
      this.template('src/app/pages/welcome/welcome.page.html.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/welcome/welcome.page.html`);
      this.template('src/app/pages/welcome/welcome.page.spec.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/welcome/welcome.page.spec.ts`);
      this.template('src/app/pages/welcome/welcome.page.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/welcome/welcome.page.ts`);
      this.template(
        'src/app/services/auth/user-route-access.service.spec.ts.ejs',
        `${CLIENT_MAIN_SRC_DIR}app/services/auth/user-route-access.service.spec.ts`
      );
      this.template(
        'src/app/services/auth/user-route-access.service.ts.ejs',
        `${CLIENT_MAIN_SRC_DIR}app/services/auth/user-route-access.service.ts`
      );
      this.template('src/app/services/login/login.service.spec.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/services/login/login.service.spec.ts`);
      this.template('src/app/services/login/login.service.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/services/login/login.service.ts`);
      this.template('src/app/services/user/user.model.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/services/user/user.model.ts`);
      this.template('src/app/services/user/user.service.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/services/user/user.service.ts`);
      this.template('src/app/services/user/user.service.spec.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/services/user/user.service.spec.ts`);

      // Delete files no longer used
      const filesToDelete = [
        `${CLIENT_MAIN_SRC_DIR}app/login`,
        `${CLIENT_MAIN_SRC_DIR}app/tab1`,
        `${CLIENT_MAIN_SRC_DIR}app/pages/signup`,
        `${CLIENT_MAIN_SRC_DIR}app/services/auth/auth-jwt.service.ts`,
        `${CLIENT_MAIN_SRC_DIR}app/services/auth/auth-jwt.service.spec.ts`,
        `${CLIENT_MAIN_SRC_DIR}app/interceptors/auth-expired.interceptor.ts`
      ];

      filesToDelete.forEach((path) => {
        if (path.endsWith('.ts') || path.endsWith('.html')) {
          this._deleteFile(path);
        } else {
          this._removeDirectory(path);
        }
      });
    } else {
      this.template('src/app/services/user/user.model.ts.ejs', `${CLIENT_MAIN_SRC_DIR}app/services/user/user.model.ts`);
    }

    // Calculate JHipster logo to use and add to Sass templates
    this.hipster = this.getHipster(this.ionicAppName);
    this.template('src/app/pages/home/home.page.scss.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/home/home.page.scss`);
    this.template('src/app/pages/welcome/welcome.page.scss.ejs', `${CLIENT_MAIN_SRC_DIR}app/pages/welcome/welcome.page.scss`);

    // Add @angular/localize if not testing
    if (this.installDeps) {
      shelljs.exec(`cd ${this.ionicAppName} && npx ng add @angular/localize`);
    }

    // Add e2e tests
    this.authenticationType = this.jhipsterAppConfig.authenticationType;
    this.template('e2e/pages/login.po.ts.ejs', `${this.ionicAppName}/e2e/pages/login.po.ts`);
    this.template('e2e/spec/login.e2e-spec.ts.ejs', `${this.ionicAppName}/e2e/spec/login.e2e-spec.ts`);

    done();
  }

  _deleteFile(path) {
    // check to see if the file exists before deleting
    try {
      fs.unlinkSync(path);
    } catch (e) {
      // file already deleted
    }
  }

  _removeDirectory(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = `${path}/${file}`;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          this._removeDirectory(curPath);
        } else {
          // delete file
          this._deleteFile(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }

  get end() {
    return {
      runPrettier() {
        if (this.installDeps) {
          shelljs.exec(`cd ${this.ionicAppName} && npm i && npm run prettier`);
        }
      },

      gitCommit() {
        if (this.installDeps) {
          const done = this.async();
          this.debug('Committing files to git');
          this.isGitInstalled((code) => {
            if (code === 0) {
              shelljs.exec(`cd ${this.ionicAppName} && git add -A`, () => {
                shelljs.exec(`cd ${this.ionicAppName} && git commit --amend --no-edit`, () => {
                  this.log(chalk.green('App successfully committed to Git.'));
                  done();
                });
              });
            } else {
              this.warning('The generated app could not be committed to Git, as a Git repository could not be initialized.');
              done();
            }
          });
        }
      },

      afterRunHook() {
        const SPONSOR_MESSAGE = 'Sponsored with ❤️  by @oktadev.';

        this.log('\nIonic for JHipster App created successfully! 🎉\n');
        this.log(`${chalk.yellowBright('You will need to update your JHipster app\'s CORS settings when running this app on an emulator or device. ⚠️\n')}`);
        this.log(`${chalk.yellowBright('    iOS: capacitor://localhost')}`);
        this.log(`${chalk.yellowBright('    Android: http://localhost')}\n`);
        this.log('Run the following commands (in separate terminal windows) to see everything working:\n');
        this.log(
          `${chalk.green(`    cd ${this.directoryPath} && ${this.jhipsterAppConfig.buildTool === 'maven' ? './mvnw' : './gradlew'}`)}`
        );
        this.log(`${chalk.green(`    cd ${this.ionicAppName} && ionic serve`)}\n`);
        this.log(chalk.cyan.bold(SPONSOR_MESSAGE));
        if (this.interactive) {
          // force quit; needed because of this.conflicter.force = true
          process.exit(0);
        }
      }
    };
  }
};
