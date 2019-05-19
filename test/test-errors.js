/* global describe, before, it */

const path = require('path');
const { assert } = require('chai');
const helpers = require('yeoman-test');
const fse = require('fs-extra');

describe('Error conditions', () => {
    describe('.yo-rc.json', () => {
        before((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .on('error', (error) => {
                    const expectedErrorMessage = /Unable to find backend\/.yo-rc.json/;
                    assert.match(error.message, expectedErrorMessage);
                    done();
                })
                .on('end', done);
        });

        it('throws error when .yo-rc.json is not found', () => {
        });
    });

    describe('package.json', () => {
        before((done) => {
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
                    appName: 'ionic4j-jwt',
                    directoryPath: 'backend-with-no-packagejson'
                })
                .on('error', (error) => {
                    const expectedErrorMessage = /Unable to find ionic4j-jwt\/package.json/;
                    assert.match(error.message, expectedErrorMessage);
                    done();
                })
                .on('end', done);
        });

        it('throws error when package.json is not found', () => {
        });
    });

    describe('old version', () => {
        before((done) => {
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
                    appName: 'ionic4j-jwt',
                    directoryPath: 'backend-with-old-version'
                })
                .on('error', (error) => {
                    const expectedErrorMessage = /Your backend uses an old JHipster version \(1.0.0\)... you need at least \(>=4.13.3 <5\)/;
                    assert.match(error.message, expectedErrorMessage);
                    done();
                })
                .on('end', done);
        });

        it('throws error when package.json is not found', () => {
        });
    });
});
