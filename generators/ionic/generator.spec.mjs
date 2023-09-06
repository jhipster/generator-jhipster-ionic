import { beforeAll, describe, expect, it } from 'vitest';

import { helpers, lookups } from '#test-utils';

const SUB_GENERATOR = 'ionic';
const SUB_GENERATOR_NAMESPACE = `jhipster-ionic:${SUB_GENERATOR}`;

const expectedJwtFiles = [
  'src/app/services/auth/auth-jwt.service.ts',
  'src/app/services/auth/auth-jwt.service.spec.ts',
  'src/app/interceptors/auth-expired.interceptor.ts',
];

describe('SubGenerator ionic of ionic JHipster blueprint', () => {
  describe('with jwt authentication', () => {
    let result;
    beforeAll(async function () {
      result = await helpers
        .create(SUB_GENERATOR_NAMESPACE)
        .withOptions({
          reproducible: true,
          blueprint: 'ionic',
          appDir: false,
          baseName: 'jhipster',
          ignoreNeedlesError: true,
          authenticationType: 'jwt',
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should generate app/services/auth/auth-jwt.service.ts', () => {
      result.assertFile(expectedJwtFiles);
    });
  });
  describe('with oauth2 authentication', () => {
    let result;
    beforeAll(async function () {
      result = await helpers
        .create(SUB_GENERATOR_NAMESPACE)
        .withOptions({
          reproducible: true,
          blueprint: 'ionic',
          appDir: false,
          baseName: 'jhipster',
          authenticationType: 'oauth2',
          ignoreNeedlesError: true,
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should not generate jwt files', () => {
      result.assertNoFile(expectedJwtFiles);
    });
  });
});
