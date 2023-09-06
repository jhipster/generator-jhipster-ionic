import ProjectNameGenerator from 'generator-jhipster/generators/project-name';
import command from './command.mjs';

export default class extends ProjectNameGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints ionic')}`);
    }
  }

  get [ProjectNameGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      ...super.initializing,
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
      defaults() {
        if (this.options.defaults || this.options.force) {
          this.config.defaults({
            baseName: this.getDefaultIonicName(),
          });
        }
      },
    });
  }

  get [ProjectNameGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,

      // Replace prompts with custom questions
      async showPrompts() {
        await this.prompt(
          [
            {
              name: 'baseName',
              type: 'input',
              validate: input => this.validateBaseName(input),
              message: 'What do you want to name your Ionic application?',
              default: this.getDefaultIonicName(),
            },
          ],
          this.config,
        );
      },
    });
  }

  get [ProjectNameGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
      async configuringTemplateTask() {},
    });
  }

  get [ProjectNameGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      ...super.composing,
      async composingTemplateTask() {},
    });
  }

  get [ProjectNameGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      ...super.loading,
      async loadingTemplateTask() {},
    });
  }

  get [ProjectNameGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,
      async preparingTemplateTask() {},
    });
  }

  get [ProjectNameGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      ...super.default,
      async defaultTemplateTask() {},
    });
  }

  get [ProjectNameGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...super.writing,
    });
  }

  get [ProjectNameGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
      async postWritingTemplateTask() {},
    });
  }

  get [ProjectNameGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      ...super.install,
      async installTemplateTask() {},
    });
  }

  get [ProjectNameGenerator.END]() {
    return this.asEndTaskGroup({
      ...super.end,
      async endTemplateTask() {},
    });
  }

  getDefaultIonicName() {
    const appYoRc = `${this.blueprintConfig.appDir}/.yo-rc.json`;
    const backendAppStorage = this.createStorage(appYoRc, 'generator-jhipster', { sorted: true });
    const backendAppConfig = backendAppStorage.getAll();
    const { baseName: backendAppBaseName = 'hipster' } = backendAppConfig || {};
    return `${backendAppBaseName}Ionic`;
  }
}
