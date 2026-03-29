const config = {
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@ionic/core|@stencil/core|@ionic/angular|ionic-appauth)'],
  coverageDirectory: './public/coverage',
  moduleNameMapper: {
    '#app/(.*)': '<rootDir>/src/app/$1',
    '^ionicons/components/ion-icon.js$': '@ionic/core/components/ion-icon.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/polyfills.ts'],
};

module.exports = config;
