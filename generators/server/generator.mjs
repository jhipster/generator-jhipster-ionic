import chalk from 'chalk';
import ServerGenerator from 'generator-jhipster/esm/generators/server';
import { PRIORITY_PREFIX, POST_WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, { priorityArgs: true, taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints ionic')}`);
    }

    this.sbsBlueprint = true;
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      async increaseOauth2Sleep({ application: { authenticationTypeOauth2, serviceDiscoveryEureka } }) {
        if (authenticationTypeOauth2) {
          this.editFile('src/main/docker/app.yml', content => content.replace('JHIPSTER_SLEEP=30', 'JHIPSTER_SLEEP=60'));
          if (serviceDiscoveryEureka) {
            this.editFile('src/main/docker/app.yml', content => content.replace('JHIPSTER_SLEEP=20', 'JHIPSTER_SLEEP=40'));
          }
        }
      },
      async postWritingTemplateTask() {
        this.editFile('src/main/resources/config/application.yml', content =>
          content.replace(/allowed-origins: (['"])(.*)['"]/, 'allowed-origins: $1$2,capacitor://localhost$1')
        );
        this.editFile('src/main/resources/config/application-dev.yml', content =>
          content.replace(/allowed-origins: (['"])(.*)['"]/, 'allowed-origins: $1$2,capacitor://localhost$1')
        );
      },
    };
  }
}
