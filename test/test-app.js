/* global describe, beforeEach, it */

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('JHipster generator jhipster-generator-ionic', () => {
    describe('Test Generating Ionic App', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates'), dir);
                })
                .withOptions({
                    skipInstall: true,
                    force: true,
                    testmode: true
                })
                .withPrompts({
                    ionicAppName: 'ionic4j',
                    directoryPath: 'backend'
                })
                .on('end', done);
        });

        it('generates a package.json file', () => {
            assert.file([
                'package.json'
            ]);
        });
    });
});
