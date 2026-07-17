import { asCommand } from 'generator-jhipster';

export default asCommand({
  configs: {
    ionicDir: {
      desc: 'Directory of JHipster application',
      cli: {
        type: String,
      },
      scope: 'blueprint',
    },
  },
});
