const chalk = require('chalk');
const packagejs = require('../../package.json');
const semver = require('semver');
const shelljs = require('shelljs');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const prompts = require('./prompts');
const writeFiles = require('./files').writeFiles;
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
                //this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.blue('Ionic JHipster')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            }
        };
    }

    get prompting() {
        return {
            confirmInstall: prompts.confirmInstall,
            askForPath: prompts.askForPath,
            askForProjectName: prompts.askForAppName
        };
    }

    writing() {
        const fromPath = this.directoryPath + '/.yo-rc.json';
        this.jhipsterAppConfig = this.fs.readJSON(fromPath)['generator-jhipster'];

        const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
        const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
        if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
            this.error(`\nYour backend uses an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
        }

        const done = this.async();
        if (shelljs.test('-d', this.ionicAppName)) {
            this.error(`Directory ${this.ionicAppName} already exists, please remove it to continue.`)
        } else {
            // todo: detect if ionic is installed, skip if it is
            this.log(`\nRunning ${chalk.yellow('npm install -g ionic cordova')}. This could take a while...`);
            //shelljs.exec('npm install -g ionic cordova', { silent: false }, (code) => {
            //  if (code === 0) {
            this.log(`\nCreating Ionic app with command: ${chalk.yellow(`ionic start ${this.ionicAppName} super`)}`);
            shelljs.exec(`ionic start ${this.ionicAppName} super`, {silent: false}, (code) => {
                if (code === 0) {
                    this.log(`\nIonic app created, integrating JHipster...`);
                    writeFiles.call(this);
                    done();
                } else {
                    let msg = 'Ionic app creation failed. Please create an issue for this on GitHub.\n';
                    msg += 'https://github.com/oktadeveloper/generator-jhipster-ionic/issues';
                    this.error(msg);
                }
            });
            //}
            //});
        }
    }

    install() {
        const done = this.async();
        // update package.json in Ionic app
        const packagePath = this.ionicAppName + '/package.json';
        const packageJSON = this.fs.readJSON(packagePath);
        modifyPackage.add(packageJSON, ['ng-jhipster', 'ng2-webstorage'])
            .then(updatedPackageJson => {
                console.log('updated package json', updatedPackageJson);
                this.fs.writeJSON(packagePath);

                modifyPackage.addDev(packageJSON, ['@types/node'])
                    .then(updatedPackageJson => {
                        console.log('updated package dev json', updatedPackageJson);
                        this.fs.writeJSON(packagePath);

                        shelljs.exec(`cd ${this.ionicAppName} && npm i`, {silent: false}, (code) => {
                            done();
                        });
                    });
            });
    }

    end() {
        this.log('\nApp created successfully! 🎉\n');
        const configPath = chalk.yellow(`${this.directoryPath}/src/main/resources/config/application.yml`);
        this.log(`Enable CORS in ${configPath}, and set the allowed-origins:\n`);
        this.log(`${chalk.green(`    cors:`)}`);
        this.log(`${chalk.green(`        allowed-origins: "http://localhost:8100"`)}\n`);
        this.log('Then run the following commands (in separate terminals) to see it working:\n');
        this.log(`${chalk.green(`    cd ${this.directoryPath} && ${this.jhipsterAppConfig.buildTool === 'maven' ? './mvnw' : './gradlew'}`)}`);
        this.log(`${chalk.green(`    cd ${this.ionicAppName} && ionic serve`)}\n`);
    }
};
