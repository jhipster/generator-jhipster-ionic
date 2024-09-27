import { readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import BaseGenerator from 'generator-jhipster/generators/base';

export default class extends BaseGenerator {
  sampleName;
  all;
  samplesFolder;

  constructor(args, opts, features) {
    super(args, opts, { ...features, queueCommandTasks: true, jhipsterBootstrap: false });
  }

  get [BaseGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async copySample() {
        const samplesFolder = `${this.samplesFolder ?? 'samples'}/`;
        if (this.all) {
          this.copyTemplate(`${samplesFolder}*.jdl`, '');
        } else {
          this.copyTemplate(`${samplesFolder}${this.sampleName}`, this.sampleName, { noGlob: true });
        }
      },
    });
  }

  get [BaseGenerator.END]() {
    return this.asEndTaskGroup({
      async generateSample() {
        const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
        const projectVersion = `${packageJson.version}-git`;

        await this.composeWithJHipster('jdl', {
          generatorArgs: this.all ? await readdir(this.templatePath('samples')) : [this.sampleName],
          generatorOptions: {
            skipJhipsterDependencies: true,
            insight: false,
            skipChecks: true,
            projectVersion,
            ...(this.all ? { workspaces: true, monorepository: true } : { skipInstall: true }),
          },
        });
      },
      async jhipsterInfo() {
        await this.composeWithJHipster('info');
      },
    });
  }
}
