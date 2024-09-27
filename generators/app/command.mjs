import { asCommand } from 'generator-jhipster';

export default asCommand({
  options: {
    ionicDir: {
      desc: 'Directory of JHipster application',
      type: String,
      scope: 'blueprint',
    },
  },
});
