/**
 * Copyright 2019-Present the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const PAGES_DIR = 'src/app/pages/';
const E2E_ENTITY_DIR = 'cypress/support/pages/';
const E2E_TEST_DIR = 'cypress/integration/';

export const files = {
  client: [
    {
      templates: [
        'capacitor.config.ts',
        'ionic.config.json',
        'src/app/interceptors/auth.interceptor.ts',
        'src/app/pages/home/home.page.scss',
        'src/app/pages/welcome/welcome.page.scss',
      ],
    },
  ],
};

export const entityFiles = {
  client: [
    {
      path: PAGES_DIR,
      templates: [
        {
          file: 'entities/_entity.html',
          method: 'processHtml',
          template: true,
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.html`,
        },
        {
          file: 'entities/_entity.model.ts',
          method: 'processHtml',
          template: true,
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.model.ts`,
        },
        {
          file: 'entities/_entity.module.ts',
          method: 'processHtml',
          template: true,
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.module.ts`,
        },
        {
          file: 'entities/_entity.service.ts',
          method: 'processHtml',
          template: true,
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.service.ts`,
        },
        {
          file: 'entities/_entity.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.ts`,
        },
        {
          file: 'entities/_entity-detail.html',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}-detail.html`,
        },
        {
          file: 'entities/_entity-detail.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}-detail.ts`,
        },
        {
          file: 'entities/_entity-update.html',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}-update.html`,
        },
        {
          file: 'entities/_entity-update.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}-update.ts`,
        },
        {
          file: 'entities/_index.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/index.ts`,
        },
        {
          file: 'entities/_entity.spec.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.spec.ts`,
        },
        {
          file: 'entities/_entity-detail.spec.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}-detail.spec.ts`,
        },
        {
          file: 'entities/_entity-update.spec.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}-update.spec.ts`,
        },
      ],
    },
  ],
  e2e: [
    {
      path: E2E_ENTITY_DIR,
      templates: [
        {
          file: 'entities/_entity.po.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.po.ts`,
        },
      ],
    },
    {
      path: E2E_TEST_DIR,
      templates: [
        {
          file: 'entities/_entity.e2e-spec.ts',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.e2e-spec.ts`,
        },
        {
          file: 'entities/_entity.json',
          renameTo: ctx => `entities/${ctx.entityFolderName}/${ctx.entityFileName}.json`,
        },
      ],
    },
  ],
};
