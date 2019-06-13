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

        it('deletes files that only apply to JWT', () => {
            assert.noFile([
                'ionic4j-oauth2/src/app/login',
                'ionic4j-oauth2/src/app/tab1',
                'ionic4j-oauth2/src/app/pages/signup',
                'ionic4j-oauth2/src/app/services/auth/auth-jwt.service.ts',
                'ionic4j-oauth2/src/app/services/auth/auth-jwt.service.spec.ts'
            ]);
        });

        it('adds @oktadev/schematics and keeps cordova-plugin-camera', () => {
            assert.fileContent('ionic4j-oauth2/package.json', /@oktadev\/schematics/);
            assert.fileContent('ionic4j-oauth2/package.json', /CAMERA_USAGE_DESCRIPTION/);
        });
    });
});
