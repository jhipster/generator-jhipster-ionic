import { beforeAll, describe, expect, it } from 'vitest';

import { helpers, lookups } from '#test-utils';

const SUB_GENERATOR = 'app';
const BLUEPRINT_NAMESPACE = `jhipster:${SUB_GENERATOR}`;

describe('SubGenerator app of ionic JHipster blueprint', () => {
  describe('run', () => {
    let result;
    beforeAll(async function () {
      result = await helpers
        .create(BLUEPRINT_NAMESPACE)
        .withOptions({
          reproducible: true,
          defaults: true,
          // Skip server and client for speed
          skipChecks: true,
          skipServer: true,
          skipClient: true,
          ignoreNeedlesError: true,
          blueprint: 'ionic',
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });

  describe('with custom ionic path', () => {
    let result;
    beforeAll(async function () {
      result = await helpers
        .create(BLUEPRINT_NAMESPACE)
        .withOptions({
          reproducible: true,
          defaults: true,
          // Skip server and client for speed
          skipChecks: true,
          skipServer: true,
          skipClient: true,
          ignoreNeedlesError: true,
          blueprint: 'ionic',
          ionicDir: '../ionic-app',
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('generates a package.json file at custom folder', () => {
      result.assertFile(['../ionic-app/package.json']);
    });
  });
});
