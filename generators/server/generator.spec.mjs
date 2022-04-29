import expect from 'expect';

import { helpers, lookups } from '#test-utils';

describe('SubGenerator server of ionic JHipster blueprint', () => {
  describe('run', () => {
    let result;
    before(async function () {
      result = await helpers
        .create('jhipster:server')
        .withOptions({
          reproducible: true,
          defaults: true,
          blueprint: 'ionic',
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });
});
