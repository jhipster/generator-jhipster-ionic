import { appendFileSync, existsSync } from 'node:fs';
import os from 'node:os';
import BaseGenerator from 'generator-jhipster/generators/base';
import { getSamples } from '../generate-sample/get-samples.mjs';
import { buildMatrix } from './build-matrix.mjs';

export default class extends BaseGenerator {
  samplesFolder;

  constructor(args, opts, features) {
    super(args, opts, { ...features, queueCommandTasks: true, jhipsterBootstrap: false });
  }

  get [BaseGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async buildMatrix() {
        const samplesFolder = this.samplesFolder ?? 'samples';
        const samples = await getSamples(this.templatePath(`../../generate-sample/templates/${samplesFolder}`));
        const matrix = buildMatrix({ samples, samplesFolder });
        const matrixoutput = `matrix<<EOF${os.EOL}${JSON.stringify(matrix)}${os.EOL}EOF${os.EOL}`;
        const filePath = process.env.GITHUB_OUTPUT;
        console.log(matrixoutput);
        if (filePath && existsSync(filePath)) {
          appendFileSync(filePath, matrixoutput, { encoding: 'utf8' });
        }
      },
    });
  }
}
