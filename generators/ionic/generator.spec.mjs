import { expect } from 'expect';

import { helpers, lookups } from '#test-utils';

const expectedJwtFiles = [
  'src/app/services/auth/auth-jwt.service.ts',
  'src/app/services/auth/auth-jwt.service.spec.ts',
  'src/app/interceptors/auth-expired.interceptor.ts',
];

describe('SubGenerator ionic of ionic JHipster blueprint', () => {
  describe('with jwt authentication', () => {
    let result;
    before(async function () {
      result = await helpers
        .create('jhipster-ionic:ionic')
        .withOptions({
          reproducible: true,
          blueprint: 'ionic',
          appDir: false,
          baseName: 'jhipster',
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
    before(async function () {
      result = await helpers
        .create('jhipster-ionic:ionic')
        .withOptions({
          reproducible: true,
          blueprint: 'ionic',
          appDir: false,
          baseName: 'jhipster',
          authenticationType: 'oauth2',
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
