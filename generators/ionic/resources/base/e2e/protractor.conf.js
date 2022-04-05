const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: ['../e2e/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome',
  },
  directConnect: true,
  baseUrl: 'http://localhost:8100/',
  framework: 'jasmine',
  SELENIUM_PROMISE_MANAGER: false,
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {},
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.json',
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: 'raw' } }));
  },
};
