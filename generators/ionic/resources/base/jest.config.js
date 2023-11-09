const config = {
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@ionic/core|@stencil/core|@ionic/angular)'],
  coverageDirectory: './public/coverage',
};

module.exports = config;
