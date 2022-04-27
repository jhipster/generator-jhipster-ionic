import chalk from 'chalk';
import ServerGenerator from 'generator-jhipster/esm/generators/server';
import { PRIORITY_PREFIX, WRITING_PRIORITY, POST_WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints ionic')}`);
    }

    this.sbsBlueprint = true;
  }

  get [WRITING_PRIORITY]() {
    return {
      async postWritingTemplateTask() {
        this.writeDestination(
          'src/main/docker/cors.env',
          `JHIPSTER_CORS_ALLOWED_ORIGINS=http://localhost:4200,http://localhost:8100
JHIPSTER_CORS_ALLOWED_METHODS=*
JHIPSTER_CORS_ALLOWED_HEADERS=*
JHIPSTER_CORS_EXPOSED_HEADERS="Authorization,Link,X-Total-Count,X-\${jhipster.clientApp.name}-alert,X-\${jhipster.clientApp.name}-error,X-\${jhipster.clientApp.name}-params"
JHIPSTER_CORS_ALLOW_CREDENTIALS=true
JHIPSTER_CORS_MAX_AGE=1800
`
        );
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      async postWritingTemplateTask() {
        this.editFile('src/main/docker/app.yml', content =>
          content.replace(
            `-app:`,
            `-app:
    env_file: ./cors.env`
          )
        );
      },
    };
  }

  editFile(filePath, ...transformCallbacks) {
    let content = this.readDestination(filePath);
    for (const cb of transformCallbacks) {
      content = cb(content);
    }
    this.writeDestination(filePath, content);
  }
}
