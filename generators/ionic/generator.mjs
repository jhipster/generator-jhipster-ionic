import chalk from 'chalk';
import { relative } from 'path';
import _ from 'lodash';
import { GeneratorBaseEntities, utils } from 'generator-jhipster';
import {
  PRIORITY_PREFIX,
  INITIALIZING_PRIORITY,
  CONFIGURING_PRIORITY,
  LOADING_PRIORITY,
  PREPARING_PRIORITY,
  WRITING_PRIORITY,
  WRITING_ENTITIES_PRIORITY,
  POST_WRITING_PRIORITY,
  INSTALL_PRIORITY,
  END_PRIORITY,
} from 'generator-jhipster/esm/priorities';

import { DEFAULT_BACKEND_PATH } from '../constants.mjs';
import { files, entityFiles } from './files.mjs';

export default class extends GeneratorBaseEntities {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    this.option('defaults', {
      desc: 'Use default options',
      type: String,
    });

    this.option('authentication-type', {
      desc: 'Authentication type',
      type: String,
    });

    this.option('base-name', {
      desc: 'Base name',
      type: String,
    });

    this.option('app-dir', {
      desc: 'Directory for JHipster application',
      type: String,
    });

    this.option('standalone', {
      desc: 'Skip backend',
      type: Boolean,
    });

    this.jhipsterOptions({
      skipCommitHook: {
        desc: 'Skip adding husky commit hooks',
        type: Boolean,
        scope: 'storage',
      },
    });

    if (this.options.help) return;

    // Don't show modularized generators hello message
    this.configOptions.showHello = false;

    if (this.blueprintConfig.ionicDir) {
      throw new Error('Ionic generator must run in Ionic application directory');
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

  async _postConstruct() {
    await this.prompt(
      [
        {
          type: 'input',
          name: 'appDir',
          message: 'Enter the directory where your JHipster app is located:',
          default: DEFAULT_BACKEND_PATH,
        },
      ],
      this.ionicStorage
    );
    this.ionicStorage.defaults({ appDir: DEFAULT_BACKEND_PATH, ionicDir: null });

    if (this.ionicConfig.appDir) {
      this.updateJHipsterStorages();
    }

    let bootstrapOptions = this.ionicConfig.appDir ? { destinationRoot: this.destinationPath(this.ionicConfig.appDir) } : {};
    await this.dependsOnJHipster('bootstrap-application', bootstrapOptions);
    await this.dependsOnJHipster('init');
  }

  get [INITIALIZING_PRIORITY]() {
    return {
      loadConfigFromJHipster() {
        if (this.jhipsterConfig.baseName && !this.localJHipsterConfig.projectName) {
          this.localJHipsterConfig.projectName = `${_.startCase(this.jhipsterConfig.baseName)}Ionic`;
        }
        if (this.jhipsterConfig.authenticationType) {
          this.localJHipsterConfig.authenticationType = this.jhipsterConfig.authenticationType;
        }
        if (this.jhipsterConfig.enableTranslation !== undefined) {
          this.localJHipsterConfig.enableTranslation = this.jhipsterConfig.enableTranslation;
        }
      },
    };
  }

  get [CONFIGURING_PRIORITY]() {
    return {
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
    };
  }

  get [LOADING_PRIORITY]() {
    return {
      loadConfig() {
        this.application = {};
        this.loadAppConfig(this.localJHipsterConfig, this.application);
        this.loadTranslationConfig(this.localJHipsterConfig, this.application);
      },
    };
  }

  get [PREPARING_PRIORITY]() {
    return {
      prepareApplication() {
        this.loadDerivedAppConfig(this.application);
      },
    };
  }

  get [WRITING_PRIORITY]() {
    return {
      async writingTemplateTask() {
        await this.writeFiles({
          sections: files,
          context: this.application,
        });

        await this.copyTemplateAsync('../resources/base/{**,**/.*}', this.destinationPath());

        if (this.application.authenticationTypeJwt) {
          await this.copyTemplateAsync('../resources/jwt/{**,**/.*}', this.destinationPath());
        }

        if (this.application.authenticationTypeOauth2) {
          await this.copyTemplateAsync('../resources/oauth2/{**,**/.*}', this.destinationPath());
        }
      },
    };
  }

  get [WRITING_ENTITIES_PRIORITY]() {
    return {
      async writeEntities({ entities }) {
        const { enableTranslation } = this.application;
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
            })
        );
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      customizePackageJson() {
        const { baseName } = this.localJHipsterConfig;
        this.packageJson.merge({
          name: _.kebabCase(baseName),
          scripts: {
            'backend:start': `cd ${this.ionicConfig.appDir} && npm run app:start`,
          },
        });
        if (this.application.authenticationTypeJwt) {
          this.debug('Removing oauth2 dependencies');
          this.packageJson.set('dependencies', {
            ...this.packageJson.get('dependencies'),
            '@ionic/storage': undefined,
            '@ionic/storage-angular': undefined,
            'ionic-appauth': undefined,
          });
        }
        if (this.application.authenticationTypeOauth2) {
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
    };
  }

  get [INSTALL_PRIORITY]() {
    return {
      async install() {
        try {
          if (this.env.sharedFs.get(this.destinationPath('package.json'))?.commited) {
            await this.spawnCommand('npm', ['install']);
          }
        } catch (error) {
          this.log.error(`Error executing 'npm install', execute by yourself.`);
        }
      },
    };
  }

  get [END_PRIORITY]() {
    return {
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
    };
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
          this
        );
      }
    } catch (e) {
      this.log(
        `${
          chalk.yellow('\nUnable to find ') +
          entityPagePath +
          chalk.yellow(' or missing required jhipster-needle. Reference to ') +
          entityAngularName
        } ${chalk.yellow(`not added to ${entityPagePath}.\n`)}`
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
          this
        );
      }
    } catch (e) {
      this.log(
        `${
          chalk.yellow('\nUnable to find ') +
          entityPagePath +
          chalk.yellow(' or missing required jhipster-needle. Reference to ') +
          entityAngularName
        } ${chalk.yellow(`not added to ${entityPagePath}.\n`)}`
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
      if (relationship.relationshipType === 'one-to-one' && relationship.ownerSide === true && relationship.otherEntityName !== 'user') {
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
