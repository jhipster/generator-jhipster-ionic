const config = {
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)', 'node_modules/(?!@ionic/core|@stencil/core|@ionic/angular)'],
  coverageDirectory: './public/coverage',
};

module.exports = config;
