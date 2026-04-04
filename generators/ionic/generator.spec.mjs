import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { rmSync } from 'node:fs';
import path from 'node:path';

import { basicHelpers, defaultHelpers as helpers, result } from 'generator-jhipster/testing';

const SUB_GENERATOR = 'ionic';
const SUB_GENERATOR_NAMESPACE = `jhipster-ionic:${SUB_GENERATOR}`;

const expectedJwtFiles = [
  'src/app/services/auth/auth-jwt.service.ts',
  'src/app/services/auth/auth-jwt.service.spec.ts',
  'src/app/interceptors/auth-expired.interceptor.ts',
];

describe('SubGenerator ionic of ionic JHipster blueprint', () => {
  describe('with jwt authentication', () => {
    beforeAll(async function () {
      await helpers
        .run(SUB_GENERATOR_NAMESPACE)
        .withJHipsterConfig()
        .withOptions({
          appDir: false,
          baseName: 'jhipster',
          ignoreNeedlesError: true,
          authenticationType: 'jwt',
        })
        .withJHipsterGenerators()
        .withConfiguredBlueprint()
        .withBlueprintConfig();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should generate app/services/auth/auth-jwt.service.ts', () => {
      result.assertFile(expectedJwtFiles);
    });
  });
  describe('with oauth2 authentication', () => {
    beforeAll(async function () {
      await helpers
        .run(SUB_GENERATOR_NAMESPACE)
        .withJHipsterConfig()
        .withOptions({
          appDir: false,
          baseName: 'jhipster',
          authenticationType: 'oauth2',
          ignoreNeedlesError: true,
        })
        .withJHipsterGenerators()
        .withConfiguredBlueprint()
        .withBlueprintConfig();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should not generate jwt files', () => {
      result.assertNoFile(expectedJwtFiles);
    });
  });
  describe('with backend', () => {
    describe('copy entities config from disk', () => {
      let rootTargetDirectory;

      beforeAll(async function () {
        await basicHelpers
          .runJDL(
            `
application {
  config {
    baseName jhipster
  }
  entities *
}
entity Customer {
    original String
}
`,
          )
          .onTargetDirectory(function (targetDirectory) {
            rootTargetDirectory = targetDirectory;
            this.targetDirectory = path.join(targetDirectory, 'backend');
            this.settings.tmpdir = false;
          })
          .withSkipWritingPriorities();

        await result
          .createJHipster(SUB_GENERATOR_NAMESPACE, { memFs: undefined })
          .onTargetDirectory(function (targetDirectory) {
            this.targetDirectory = path.join(targetDirectory, '../frontend');
            this.settings.tmpdir = false;
          })
          .withOptions({
            appDir: '../backend',
            ignoreNeedlesError: true,
          })
          .withJHipsterGenerators()
          .withConfiguredBlueprint()
          .withBlueprintConfig()
          .withSkipWritingPriorities();
      });

      afterAll(() => {
        rmSync(rootTargetDirectory, { recursive: true });
      });

      it('should copy entities config', () => {
        expect(result.getStateSnapshot()).toMatchSnapshot();
      });
    });

    describe('copy entities config from memory', () => {
      let rootTargetDirectory;

      beforeAll(async function () {
        await helpers
          .runJDL(
            `
application {
  config {
    baseName jhipster
  }
  entities *
}
entity Customer {
    original String
}
`,
          )
          .onTargetDirectory(function (targetDirectory) {
            rootTargetDirectory = targetDirectory;
            this.targetDirectory = path.join(targetDirectory, 'backend');
            this.settings.tmpdir = false;
          })
          .withSkipWritingPriorities();

        await result
          .createJHipster(SUB_GENERATOR_NAMESPACE, { memFs: undefined })
          .onTargetDirectory(function (targetDirectory) {
            this.targetDirectory = path.join(targetDirectory, '../frontend');
            this.settings.tmpdir = false;
          })
          .withOptions({
            appDir: '../backend',
            ignoreNeedlesError: true,
          })
          .withJHipsterGenerators()
          .withConfiguredBlueprint()
          .withBlueprintConfig()
          .withSkipWritingPriorities();
      });

      afterAll(() => {
        rmSync(rootTargetDirectory, { recursive: true });
      });

      it('should copy entities config', () => {
        expect(result.getStateSnapshot()).toMatchSnapshot();
      });
    });
  });
});
