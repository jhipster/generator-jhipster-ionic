import { relative } from 'node:path';

import chalk from 'chalk';
import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { createNeedleCallback } from 'generator-jhipster/generators/base-core/support';
import { generateTestEntity } from 'generator-jhipster/generators/client/support';
import { camelCase, kebabCase, startCase } from 'lodash-es';

import { DEFAULT_BACKEND_PATH } from '../constants.mjs';

import { entityFiles, files } from './files.mjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, storeBlueprintVersion: true, sbsBlueprint: true, jhipster7Migration: true });

    if (this.options.help) return;

    // Added to generator-jhipster 9.0.1
    if (this.blueprintConfig.blueprintVersion) {
      this.getContextData(this.getBlueprintOldVersionKey(), { factory: () => this.blueprintConfig.blueprintVersion });
    }

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
    if (this.options.defaults || this.options.force) {
      this.ionicStorage.defaults({ appDir: DEFAULT_BACKEND_PATH });
    }
  }

  // Added to generator-jhipster 9.0.1
  getBlueprintOldVersionKey() {
    return `oldVersion:${this.rootGeneratorName()}`;
  }

  // Added to generator-jhipster 9.0.1
  getBlueprintOldVersion() {
    try {
      return this.getContextData(this.getBlueprintOldVersionKey());
    } catch {
      return undefined;
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

    await this.dependsOnBootstrap('client', {
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

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      loadConfigFromBackend() {
        if (!this.blueprintConfig.appDir) return;

        try {
          this.copyDestination('.jhipster/**', '', {
            fromBasePath: this.destinationPath(this.blueprintConfig.appDir),
            globOptions: { dot: true },
          });
        } catch {
          // No entities.
        }
        try {
          // TODO workaround mem-fs-editor bug copying from memmory using glob pattern.
          this.copyDestination(this.destinationPath(this.blueprintConfig.appDir, '.jhipster/**'), '', {
            fromBasePath: this.destinationPath(this.blueprintConfig.appDir),
            globOptions: { dot: true },
            storeMatchOptions: { dot: true },
          });
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
      async cleanup({ application, control }) {
        // Consider version 8.7.0 as initial version
        const oldBlueprintVersion = (this.getBlueprintOldVersion() ?? control.jhipsterOldVersion) ? '8.7.0' : undefined;
        await control.cleanupFiles(oldBlueprintVersion, {
          '8.7.1': [
            'jest.config.js',
            'src/app/pages/account/account.module.ts',
            'src/app/pages/tabs/tabs.module.ts',
            'src/app/pages/tabs/tabs.router.module.ts',
            'src/app/app-routing.module.ts',
            'src/app/app.module.ts',
            'src/app/pages/home/home.module.ts',
            'src/app/pages/login/login.module.ts',
            'src/app/pages/welcome/welcome.module.ts',
            [application.authenticationTypeJwt, 'src/app/pages/signup/signup.module.ts'],
            [
              application.authenticationTypeOauth2,
              'src/app/auth/auth-callback/auth-callback.module.ts',
              'src/app/auth/end-session/end-session.module.ts',
              'src/app/auth/auth.module.ts',
            ],
          ],
        });
      },
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
              const { entityNameHumanized, entityAngularName, entityFileName, entityFolderName } = entity;
              this.editFile(
                'src/app/pages/entities/entities.page.ts',
                createNeedleCallback({
                  needle: 'jhipster-needle-add-entity-page',
                  contentToAdd: `{ name: '${entityNameHumanized}', component: '${entityAngularName}Page', route: '${entityFileName}' },`,
                  contentToCheck: `route: '${entityFileName}'`,
                }),
              );
              this.editFile(
                'src/app/pages/entities/entities.module.ts',
                createNeedleCallback({
                  needle: 'jhipster-needle-add-entity-route',
                  contentToAdd: `{ path: '${entityFileName}', loadChildren: () => import('./${entityFolderName}/${entityFileName}.module').then(m => m.default) },`,
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
        variableName = camelCase(relationship.otherEntity.entityNameCapitalizedPlural);
        if (variableName === entityInstance) {
          variableName += 'Collection';
        }
        const relationshipFieldName = `this.${entityInstance}.${relationship.relationshipFieldName}`;
        const relationshipFieldNameIdCheck =
          dto === 'no' ? `!${relationshipFieldName} || !${relationshipFieldName}.id` : `!${relationshipFieldName}Id`;

        query = `this.${relationship.otherEntity.entityName}Service
            .query({filter: '${relationship.otherEntity.entityRelationshipName.toLowerCase()}-is-null'})
            .subscribe(data => {
                if (${relationshipFieldNameIdCheck}) {
                    this.${variableName} = data.body;
                } else {
                    this.${relationship.otherEntity.entityName}Service
                        .find(${relationshipFieldName}${dto === 'no' ? '.id' : 'Id'})
                        .subscribe((subData: HttpResponse<${relationship.otherEntity.entityAngularName}>) => {
                            this.${variableName} = [subData.body].concat(subData.body);
                        }, (error) => this.onError(error));
                }
            }, (error) => this.onError(error));`;
      } else if (relationship.relationshipType !== 'one-to-many') {
        variableName = camelCase(relationship.otherEntity.entityNameCapitalizedPlural);
        if (variableName === entityInstance) {
          variableName += 'Collection';
        }
        query = `this.${relationship.otherEntity.entityName}Service.query()
            .subscribe(data => { this.${variableName} = data.body; }, (error) => this.onError(error));`;
      }
      if (variableName && !queries.includes(query)) {
        queries.push(query);
        variables.push(`${variableName}: ${relationship.otherEntity.entityAngularName}[];`);
      }
    });
    return {
      queries,
      variables,
      hasManyToMany,
    };
  }
}
