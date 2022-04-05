import chalk from 'chalk';
import { relative } from 'path';
import AppGenerator from 'generator-jhipster/esm/generators/app';
import { PRIORITY_PREFIX, PROMPTING_PRIORITY, COMPOSING_PRIORITY } from 'generator-jhipster/esm/priorities';

import { DEFAULT_IONIC_PATH, IONIC_NAMESPACE } from '../constants.mjs';

export default class extends AppGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    this.option('ionic-dir', {
      desc: 'Directory of JHipster application',
      type: String,
    });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints ionic')}`);
    }

    if (this.blueprintConfig.appDir) {
      throw new Error('jhipster-ionic:app generator must run in backend application directory');
    }

    if (this.options.ionicDir) {
      this.blueprintConfig.ionicDir = this.options.ionicDir;
    }
    if (this.options.defaults || this.options.force) {
      this.blueprintStorage.defaults({ ionicDir: DEFAULT_IONIC_PATH });
    }

    this.sbsBlueprint = true;
  }

  get [PROMPTING_PRIORITY]() {
    return {
      async promptyForIonicDir() {
        await this.prompt(
          [
            {
              type: 'input',
              name: 'ionicDir',
              message: 'Where do you want to generate an Ionic application?',
              default: DEFAULT_IONIC_PATH,
            },
          ],
          this.blueprintStorage
        );
        this.blueprintStorage.defaults({ ionicDir: DEFAULT_IONIC_PATH });
      },
    };
  }

  get [COMPOSING_PRIORITY]() {
    return {
      async composeIonic() {
        if (this.jhipsterConfig.applicationType === 'microservice') return;
        const ionicDir = this.destinationPath(this.blueprintConfig.ionicDir);
        const appDir = relative(ionicDir, this.destinationPath());
        await this.composeWithJHipster(`${IONIC_NAMESPACE}:ionic`, {
          destinationRoot: ionicDir,
          appDir,
        });
      },
    };
  }
}
