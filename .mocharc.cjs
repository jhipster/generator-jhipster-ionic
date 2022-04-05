module.exports = {
  recursive: true,
  reporter: 'spec',
  slow: 0,
  timeout: 30000,
  ui: 'bdd',
  extension: ['spec.js', 'spec.cjs', 'spec.mjs'],
  exclude: ['**/resources/**', '**/node_modules/**'],
  require: 'mocha-expect-snapshot',
  parallel: true,
};
