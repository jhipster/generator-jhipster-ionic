import expect from 'expect';

import { helpers, lookups } from '#test-utils';

describe('SubGenerator project-name of ionic JHipster blueprint', () => {
  describe('run', () => {
    let result;
    before(async function () {
      result = await helpers
        .create('jhipster:project-name')
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
