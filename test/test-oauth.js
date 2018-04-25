/* global describe, beforeEach, it */

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('JHipster generator jhipster-generator-ionic', () => {
    describe('Test Generating Ionic App with OAuth', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates'), dir);
                })
                .withOptions({
                    interactive: false,
                    installDeps: false
                })
                .withPrompts({
                    appName: 'ionic4j-oauth2',
                    directoryPath: 'backend-oauth2'
                })
                .on('end', done);
        });

        it('generates a ionic4j-oauth2/package.json file', () => {
            assert.file(['ionic4j-oauth2/package.json']);
        });

        it('adds a AuthInfoResource.java file to backend-oauth2', () => {
            assert.file(['backend-oauth2/src/main/java/com/okta/developer/web/rest/AuthInfoResource.java']);
        });
    });
});
