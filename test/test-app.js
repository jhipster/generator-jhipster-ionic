const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('JHipster generator jhipster-generator-ionic', () => {
  describe('Test Generating Ionic App with JWT', () => {
    beforeEach(() => helpers
      .create(path.join(__dirname, '../generators/app'))
      .inTmpDir((dir) => {
        fse.copySync(path.join(__dirname, '../test/templates'), dir);
      })
      .withOptions({
        interactive: false,
        installDeps: false
      })
      .withPrompts({
        appName: 'ionic4j-jwt',
        directoryPath: 'backend-jwt'
      })
      .run());

    it('generates a ionic4j-jwt/package.json file', () => {
      assert.file(['ionic4j-jwt/package.json']);
    });

    it('does not delete app/services/auth/auth-jwt.service.ts', () => {
      assert.file('ionic4j-jwt/src/app/services/auth/auth-jwt.service.ts');
    });
  });
});
