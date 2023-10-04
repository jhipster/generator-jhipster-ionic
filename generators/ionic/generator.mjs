import { relative } from 'node:path';
import chalk from 'chalk';
import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { kebabCase, startCase } from 'lodash-es';
import command from './command.mjs';
import { DEFAULT_BACKEND_PATH } from '../constants.mjs';
import { files } from './files.mjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });

    if (this.options.help) return;

    if (this.blueprintConfig.ionicDir) {
      throw new Error('Ionic generator must run in Ionic application directory, to regenerate backend execute `jhipster-ionic app`');
    }

    this.ionicStorage = this.blueprintStorage;
    this.ionicConfig = this.blueprintConfig;

    this.localJHipsterStorage = this._config;
    this.localJHipsterConfig = this.jhipsterConfig;

    // Set defaultIndent to 2 to hide prompt
    this.jhipsterConfig.prettierDefaultIndent = 2;

    if (this.options.standalone) {
      this.ionicConfig.appDir = false;
    }
    if (this.options.appDir !== undefined) {
      this.ionicConfig.appDir = this.options.appDir;
    }
    if (this.options.baseName !== undefined) {
      this.localJHipsterConfig.baseName = this.options.baseName;
    }
    if (this.options.authenticationType !== undefined) {
      this.localJHipsterConfig.authenticationType = this.options.authenticationType;
    }
    if (this.options.defaults || this.options.force) {
      this.ionicStorage.defaults({ appDir: DEFAULT_BACKEND_PATH });
    }
  }

  async beforeQueue() {
    await this.prompt(
      [
        {
          type: 'input',
          name: 'appDir',
          message: 'Enter the directory where your JHipster app is located:',
          default: DEFAULT_BACKEND_PATH,
        },
      ],
      this.ionicStorage,
    );
    this.ionicStorage.defaults({ appDir: DEFAULT_BACKEND_PATH, ionicDir: null });

    if (this.ionicConfig.appDir) {
      this.updateJHipsterStorages();
    }

    await this.dependsOnJHipster('bootstrap-application');
    await this.dependsOnJHipster('init');
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      loadConfigFromJHipster() {
        if (this.jhipsterConfig.baseName && !this.localJHipsterConfig.projectName) {
          this.localJHipsterConfig.projectName = `${startCase(this.jhipsterConfig.baseName)}Ionic`;
        }
        if (this.jhipsterConfig.authenticationType) {
          this.localJHipsterConfig.authenticationType = this.jhipsterConfig.authenticationType;
        }
        if (this.jhipsterConfig.enableTranslation !== undefined) {
          this.localJHipsterConfig.enableTranslation = this.jhipsterConfig.enableTranslation;
        }
      },

      configure() {
        // Set default baseName.
        if (this.jhipsterConfig.baseName && !this.localJHipsterConfig.baseName) {
          this.localJHipsterConfig.baseName = `${this.jhipsterConfig.baseName}Ionic`;
        }

        // Add blueprint config to generator-jhipster namespace, so we can omit blueprint parameter when executing jhipster command
        const localBlueprints = this.localJHipsterConfig.blueprints;
        if (!localBlueprints || !localBlueprints.find(blueprint => blueprint.name === 'generator-jhipster-ionic')) {
          this.localJHipsterConfig.blueprints = [...(localBlueprints || []), { name: 'generator-jhipster-ionic' }];
        }

        if (this.jhipsterConfig.baseName && this.ionicConfig.appDir) {
          const ionicDir = relative(this.destinationPath(this.ionicConfig.appDir), this.destinationPath());

          // Add back reference
          this.blueprintConfig.ionicDir = ionicDir;
          this.blueprintConfig.appDir = null;
        }
      },
    });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writingTemplateTask({ application }) {
        await this.writeFiles({
          sections: files,
          context: application,
        });

        await this.copyTemplateAsync('../resources/base/{**,**/.*}', this.destinationPath());

        if (application.authenticationTypeJwt) {
          await this.copyTemplateAsync('../resources/jwt/{**,**/.*}', this.destinationPath());
        }

        if (application.authenticationTypeOauth2) {
          await this.copyTemplateAsync('../resources/oauth2/{**,**/.*}', this.destinationPath());
        }
      },
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
    return this.asWritingEntitiesTaskGroup({
      async writeEntities({ application, entities }) {
        const { enableTranslation } = application;
        await Promise.all(
          entities
            .filter(entity => !entity.builtIn)
            .map(async entity => {
              await this.writeFiles({
                sections: entityFiles,
                context: {
                  ...entity,
                  enableTranslation,
                },
              });
              // write client side files for angular
              const { entityClassHumanized, entityAngularName, entityFileName, entityFolderName } = entity;
              this.addEntityToModule({ entityClassHumanized, entityAngularName, entityFileName });
              this.addEntityRouteToModule({ entityAngularName, entityFolderName, entityFileName });
            }),
        );
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizePackageJson({ application }) {
        const { baseName } = this.localJHipsterConfig;
        this.packageJson.merge({
          name: kebabCase(baseName),
          scripts: {
            'backend:start': `cd ${this.ionicConfig.appDir} && npm run app:start`,
          },
        });
        if (application.authenticationTypeJwt) {
          this.debug('Removing oauth2 dependencies');
          this.packageJson.set('dependencies', {
            ...this.packageJson.get('dependencies'),
            '@ionic/storage': undefined,
            '@ionic/storage-angular': undefined,
            'ionic-appauth': undefined,
          });
        }
        if (application.authenticationTypeOauth2) {
          this.packageJson.merge({
            jest: {
              moduleNameMapper: {
                '^@ionic/storage$': '<rootDir>/node_modules/@ionic/storage/dist/ionic-storage.cjs.js',
              },
              transformIgnorePatterns: [
                'node_modules/(?!.*\\.mjs$|@ngrx|@ionic-native|@ionic|ionic-appauth|capacitor-secure-storage-plugin)',
              ],
            },
          });
        }
      },
    });
  }

  get [BaseApplicationGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      async install() {
        try {
          if (this.env.sharedFs.get(this.destinationPath('package.json'))?.commited) {
            await this.spawnCommand('npm', ['install']);
          }
        } catch (error) {
          this.log.error(`Error executing 'npm install', execute by yourself.`);
        }
      },
    });
  }

  get [BaseApplicationGenerator.END]() {
    return this.asEndTaskGroup({
      afterRunHook() {
        const changeDirMessage = this.options.fromBackend
          ? `
${chalk.green(`    cd ${this.blueprintConfig.ionicDir}`)}`
          : '';
        this.log(`
Ionic for JHipster App created successfully! 🎉
${chalk.yellowBright("You will need to update your JHipster app's CORS settings when running this app on an emulator or device. ⚠️\n")}
${chalk.yellowBright('    iOS: capacitor://localhost')}
${chalk.yellowBright('    Android: http://localhost')}

Run the following commands (in separate terminal window) to see everything working:${changeDirMessage}
${chalk.green(`    npm run backend:start`)}
${chalk.green(`    npm start`)}
`);
      },
    });
  }

  /**
   * @private
   * Update Storages for Ionic
   */
  updateJHipsterStorages() {
    const appYoRc = `${this.blueprintConfig.appDir}/.yo-rc.json`;
    this._config = this.createStorage(appYoRc, 'generator-jhipster', { sorted: true });
    this.jhipsterConfig = this.config.createProxy();
    this.blueprintStorage = this.createStorage(appYoRc, this.rootGeneratorName(), { sorted: true });
    this.blueprintConfig = this.blueprintStorage.createProxy();
  }

  /**
   * @private
   * Add a new entity in the TS modules file.
   *
   * @param {string} options - Entity Instance
   * @param {string} options.entityClassHumanized - Entity Class
   * @param {string} options.entityAngularName - Entity Angular Name
   * @param {string} options.entityFileName - Entity File Name
   */
  addEntityToModule({ entityClassHumanized, entityAngularName, entityFileName }) {
    // workaround method being called on initialization
    if (!entityAngularName) {
      return;
    }
    const entityPagePath = 'src/app/pages/entities/entities.page.ts';
    try {
      const isSpecificEntityAlreadyGenerated = utils.checkStringInFile(entityPagePath, `route: '${entityFileName}'`, this);

      if (!isSpecificEntityAlreadyGenerated) {
        const pageEntry = `{ name: '${entityClassHumanized}', component: '${entityAngularName}Page', route: '${entityFileName}' },`;
        utils.rewriteFile(
          {
            file: entityPagePath,
            needle: 'jhipster-needle-add-entity-page',
            splicable: [this.stripMargin(pageEntry)],
          },
          this,
        );
      }
    } catch (e) {
      this.log(
        `${
          chalk.yellow('\nUnable to find ') +
          entityPagePath +
          chalk.yellow(' or missing required jhipster-needle. Reference to ') +
          entityAngularName
        } ${chalk.yellow(`not added to ${entityPagePath}.\n`)}`,
      );
      this.debug('Error:', e);
    }
  }

  /**
   * @private
   * Add a new route in the TS modules file.
   *
   * @param {string} entityInstance - Entity Instance
   * @param {string} entityClass - Entity Class
   * @param {string} entityAngularName - Entity Angular Name
   * @param {string} entityFolderName - Entity Folder Name
   * @param {string} entityFileName - Entity File Name
   * @param {boolean} enableTranslation - If translations are enabled or not
   */
  addEntityRouteToModule({ entityAngularName, entityFolderName, entityFileName }) {
    // workaround method being called on initialization
    if (!entityAngularName) {
      return;
    }
    const entityPagePath = 'src/app/pages/entities/entities.module.ts';
    try {
      const isSpecificEntityAlreadyGenerated = utils.checkStringInFile(entityPagePath, `path: '${entityFileName}'`, this);
      if (!isSpecificEntityAlreadyGenerated) {
        const route = `| {
                    |    path: '${entityFileName}',
                    |    loadChildren: () => import('./${entityFolderName}/${entityFileName}.module').then(m => m.${entityAngularName}PageModule)
                    |  },`;
        utils.rewriteFile(
          {
            file: entityPagePath,
            needle: 'jhipster-needle-add-entity-route',
            splicable: [this.stripMargin(route)],
          },
          this,
        );
      }
    } catch (e) {
      this.log(
        `${
          chalk.yellow('\nUnable to find ') +
          entityPagePath +
          chalk.yellow(' or missing required jhipster-needle. Reference to ') +
          entityAngularName
        } ${chalk.yellow(`not added to ${entityPagePath}.\n`)}`,
      );
      this.debug('Error:', e);
    }
  }

  /**
   * private
   * Generate Entity Queries for Ionic Providers
   *
   * @param {Array|Object} relationships - array of relationships
   * @param {string} entityInstance - entity instance
   * @param {string} dto - dto
   * @returns {{queries: Array, variables: Array, hasManyToMany: boolean}}
   */
  generateEntityQueries(relationships, entityInstance, dto) {
    // workaround method being called on initialization
    if (!relationships) {
      return;
    }
    const queries = [];
    const variables = [];
    let hasManyToMany = false;
    relationships.forEach(relationship => {
      let query;
      let variableName;
      hasManyToMany = hasManyToMany || relationship.relationshipType === 'many-to-many';
      if (relationship.otherRelationship && relationship.relationshipType === 'one-to-one' && relationship.ownerSide === true) {
        variableName = _.camelCase(relationship.otherEntityNameCapitalizedPlural);
        if (variableName === entityInstance) {
          variableName += 'Collection';
        }
        const relationshipFieldName = `this.${entityInstance}.${relationship.relationshipFieldName}`;
        const relationshipFieldNameIdCheck =
          dto === 'no' ? `!${relationshipFieldName} || !${relationshipFieldName}.id` : `!${relationshipFieldName}Id`;

        query = `this.${relationship.otherEntityName}Service
            .query({filter: '${relationship.otherEntityRelationshipName.toLowerCase()}-is-null'})
            .subscribe(data => {
                if (${relationshipFieldNameIdCheck}) {
                    this.${variableName} = data.body;
                } else {
                    this.${relationship.otherEntityName}Service
                        .find(${relationshipFieldName}${dto === 'no' ? '.id' : 'Id'})
                        .subscribe((subData: HttpResponse<${relationship.otherEntityAngularName}>) => {
                            this.${variableName} = [subData.body].concat(subData.body);
                        }, (error) => this.onError(error));
                }
            }, (error) => this.onError(error));`;
      } else if (relationship.relationshipType !== 'one-to-many') {
        variableName = _.camelCase(relationship.otherEntityNameCapitalizedPlural);
        if (variableName === entityInstance) {
          variableName += 'Collection';
        }
        query = `this.${relationship.otherEntityName}Service.query()
            .subscribe(data => { this.${variableName} = data.body; }, (error) => this.onError(error));`;
      }
      if (variableName && !queries.includes(query)) {
        queries.push(query);
        variables.push(`${variableName}: ${relationship.otherEntityAngularName}[];`);
      }
    });
    return {
      queries,
      variables,
      hasManyToMany,
    };
  }
}
