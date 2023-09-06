import chalk from 'chalk';
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
    });
  }

  get [ProjectNameGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,

      // Replace prompts with custom questions
      async showPrompts() {
        const appYoRc = `${this.blueprintConfig.appDir}/.yo-rc.json`;
        const backendAppStorage = this.createStorage(appYoRc, 'generator-jhipster', { sorted: true });
        const backendAppConfig = backendAppStorage.getAll();
        const { baseName: backendAppBaseName = 'hipster' } = backendAppConfig || {};
        const defaultIonicName = `${backendAppBaseName}Ionic`;

        await this.prompt(
          [
            {
              name: 'baseName',
              type: 'input',
              validate: input => this._validateBaseName(input),
              message: 'What do you want to name your Ionic application?',
              default: defaultIonicName,
            },
            {
              name: 'projectName',
              type: 'input',
              message: 'What do you want to title your Ionic application?',
              default: ({ baseName }) => `${baseName ? startCase(baseName) : startCase(defaultIonicName)} Application`,
            },
          ],
          this.config
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
}
