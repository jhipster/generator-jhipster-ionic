/**
 * @type {import('generator-jhipster').JHipsterCommandDefinition}
 */
const command = {
  options: {
    ionicDir: {
      desc: 'Directory of JHipster application',
      type: String,
      scope: 'blueprint',
    },
  },
};

export default command;
