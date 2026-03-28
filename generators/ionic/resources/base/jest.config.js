const config = {
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@ionic/core|@stencil/core|@ionic/angular|ionic-appauth)'],
  coverageDirectory: './public/coverage',
  moduleNameMapper: {
    '#app/(.*)': '<rootDir>/src/app/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/polyfills.ts'],
};

module.exports = config;
