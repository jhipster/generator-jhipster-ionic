const config = {
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@ionic/core|@stencil/core|@ionic/angular|ionic-appauth)'],
  coverageDirectory: './public/coverage',
};

module.exports = config;
