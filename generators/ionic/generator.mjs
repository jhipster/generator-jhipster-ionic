import { relative } from 'node:path';
import chalk from 'chalk';
import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { generateTestEntity } from 'generator-jhipster/generators/client/support';
import { camelCase, kebabCase, startCase } from 'lodash-es';
import { createNeedleCallback } from 'generator-jhipster/generators/base/support';
import { DEFAULT_BACKEND_PATH } from '../constants.mjs';
import command from './command.mjs';
import { entityFiles, files } from './files.mjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true, jhipster7Migration: true });

    if (this.options.help) return;

    if (this.blueprintConfig.ionicDir) {
      throw new Error('Ionic generator must run in Ionic application directory, to regenerate backend execute `jhipster-ionic app`');
    }

    this.ionicStorage = this.blueprintStorage;
    this.ionicConfig = this.blueprintConfig;

    // Set defaultIndent to 2 to hide prompt
    this.jhipsterConfig.prettierDefaultIndent = 2;

    if (this.options.standalone) {
      this.ionicConfig.appDir = false;
    }
    if (this.options.appDir !== undefined) {
      this.ionicConfig.appDir = this.options.appDir;
    }
    if (this.options.baseName !== undefined) {
      this.jhipsterConfig.baseName = this.options.baseName;
    }
    if (this.options.authenticationType !== undefined) {
      this.jhipsterConfig.authenticationType = this.options.authenticationType;
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
      this.addBackendStorages();
    }

    await this.dependsOnJHipster('bootstrap-application', {
      generatorOptions: {
        defaultBaseName: () => {
          const appYoRc = `${this.blueprintConfig.appDir}/.yo-rc.json`;
          const backendAppBaseName = this.readDestinationJSON(appYoRc)?.['generator-jhipster']?.baseName ?? 'hipster';
          return `${backendAppBaseName}Ionic`;
        },
      },
    });
    await this.dependsOnJHipster('init');
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {
        this.parseJHipsterCommand(command);
      },
    });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      loadConfigFromBackend() {
        if (!this.blueprintConfig.appDir) return;

        try {
          this.copyDestination('.jhipster/**', '', { fromBasePath: this.destinationPath(this.blueprintConfig.appDir) });
        } catch {
          // No entities.
        }

        if (this.backendConfig?.entities && !this.jhipsterConfig.entities) {
          this.jhipsterConfig.entities = this.backendConfig.entities;
        }
        if (this.backendConfig?.baseName && !this.jhipsterConfig.projectName) {
          this.jhipsterConfig.projectName = `${startCase(this.backendConfig.baseName)}Ionic`;
        }
        if (this.backendConfig?.authenticationType) {
          this.jhipsterConfig.authenticationType = this.backendConfig.authenticationType;
        }
        if (this.jhipsterConfig.enableTranslation === undefined && this.backendConfig?.enableTranslation !== undefined) {
          this.jhipsterConfig.enableTranslation = this.backendConfig.enableTranslation;
        }

        // Set default baseName.
        if (this.backendConfig?.baseName && !this.jhipsterConfig.baseName) {
          this.jhipsterConfig.baseName = `${this.backendConfig.baseName}Ionic`;
        }

        if (this.backendConfig?.baseName) {
          const ionicDir = relative(this.destinationPath(this.ionicConfig.appDir), this.destinationPath());

          // Add back reference
          this.backendBlueprintConfig.ionicDir = ionicDir;
          this.backendBlueprintConfig.appDir = null;
        }
      },
      blueprint() {
        // Add blueprint config to generator-jhipster namespace, so we can omit blueprint parameter when executing jhipster command
        const ionicBlueprints = this.jhipsterConfig.blueprints;
        if (!ionicBlueprints || !ionicBlueprints.find(blueprint => blueprint.name === 'generator-jhipster-ionic')) {
          this.jhipsterConfig.blueprints = [...(this.jhipsterConfig.blueprints || []), { name: 'generator-jhipster-ionic' }];
        }
      },
    });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composeGit() {
        await this.composeWithJHipster('git');
      },
    });
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      loading({ application }) {
        application.typescriptEslint = true;
      },
    });
  }

  get [BaseApplicationGenerator.DEFAULT]() {
    return this.asLoadingTaskGroup({
      npmInstall() {
        this.env.watchForPackageManagerInstall({
          cwd: this.destinationPath(),
          installTask: 'Ionic install task',
        });
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
              this.editFile(
                'src/app/pages/entities/entities.page.ts',
                createNeedleCallback({
                  needle: 'jhipster-needle-add-entity-page',
                  contentToAdd: `{ name: '${entityClassHumanized}', component: '${entityAngularName}Page', route: '${entityFileName}' },`,
                  contentToCheck: `route: '${entityFileName}'`,
                }),
              );
              this.editFile(
                'src/app/pages/entities/entities.module.ts',
                createNeedleCallback({
                  needle: 'jhipster-needle-add-entity-route',
                  contentToAdd: `{ path: '${entityFileName}', loadChildren: () => import('./${entityFolderName}/${entityFileName}.module').then(m => m.${entityAngularName}PageModule) },`,
                  contentToCheck: `path: '${entityFileName}'`,
                }),
              );
            }),
        );
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      addPrettierConfig({ source }) {
        source.mergePrettierConfig({
          overrides: [{ files: '*.html', options: { parser: 'angular' } }],
        });
      },
      customizePackageJson({ application }) {
        const { baseName } = this.jhipsterConfig;
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
              transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@ngrx|@ionic-native|@ionic|ionic-appauth)'],
            },
          });
        }
      },
    });
  }

  get [BaseApplicationGenerator.END]() {
    return this.asEndTaskGroup({
      afterRunHook() {
        const changeDirMessage = this.options.fromBackend
          ? `
${chalk.green(`    cd ${this.backendBlueprintConfig.ionicDir}`)}`
          : '';
        this.log(`
Ionic for JHipster App created successfully! 🎉
${chalk.yellowBright("\nYou will need to update your JHipster app's CORS settings when running this app on an emulator or device. ⚠️\n")}
${chalk.yellowBright('    iOS: capacitor://localhost')}
${chalk.yellowBright('    Android: http://localhost')}

Run the following commands (in separate terminal windows) to see everything working:${changeDirMessage}
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
  addBackendStorages() {
    const appYoRc = `${this.blueprintConfig.appDir}/.yo-rc.json`;
    this.backendStorage = this.createStorage(appYoRc, 'generator-jhipster', { sorted: true });
    this.backendConfig = this.backendStorage.createProxy();
    this.backendBlueprintStorage = this.createStorage(appYoRc, this.rootGeneratorName(), { sorted: true });
    this.backendBlueprintConfig = this.backendBlueprintStorage.createProxy();
  }

  /**
   * @private
   * Generate a test entity instance with faked values.
   *
   * @param {any} references - references to other entities.
   * @param {any} additionalFields - additional fields to add to the entity or with default values that overrides generated values.
   */
  generateTestEntity(references, additionalFields) {
    return generateTestEntity(references, additionalFields);
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
        variableName = camelCase(relationship.otherEntityNameCapitalizedPlural);
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
        variableName = camelCase(relationship.otherEntityNameCapitalizedPlural);
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
