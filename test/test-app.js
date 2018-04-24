/* global describe, beforeEach, it */

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

xdescribe('JHipster generator jhipster-generator-ionic', () => {
    describe('Test Generating Ionic App', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/backend'), dir);
                })
                .withPrompts({
                    ionicAppName: 'ionic4j',
                    directoryPath: './templates/backend'
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
