import { asCommand } from 'generator-jhipster';

export default asCommand({
  configs: {
    skipCommitHook: {
      desc: 'Skip adding husky commit hooks',
      cli: {
        type: Boolean,
      },
      scope: 'storage',
    },
    defaults: {
      desc: 'Use default options',
      cli: {
        type: Boolean,
      },
      scope: 'none',
    },
    authenticationType: {
      desc: 'Authentication type',
      cli: {
        type: String,
      },
      scope: 'storage',
    },
    baseName: {
      desc: 'Base name',
      cli: {
        type: String,
      },
      scope: 'storage',
    },
    appDir: {
      desc: 'Directory for JHipster application',
      cli: {
        type: String,
      },
      scope: 'blueprint',
    },
    standalone: {
      desc: 'Skip backend',
      cli: {
        type: Boolean,
      },
      scope: 'none',
    },
  },
});
