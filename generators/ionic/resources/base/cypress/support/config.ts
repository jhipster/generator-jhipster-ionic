import { apiHost as environmentHost } from '../../src/environments/environment';

export const USER_USERNAME = Cypress.env('E2E_USERNAME') || 'user';
export const USER_PASSWORD = Cypress.env('E2E_PASSWORD') || 'user';

export const ADMIN_USERNAME = Cypress.env('ADMIN_E2E_USERNAME') || Cypress.env('E2E_USERNAME') || 'admin';
export const ADMIN_PASSWORD = Cypress.env('ADMIN_E2E_PASSWORD') || Cypress.env('E2E_PASSWORD') || 'admin';

export const apiHost = Cypress.env('API_HOST') || environmentHost.replace(/\/$/, '');
