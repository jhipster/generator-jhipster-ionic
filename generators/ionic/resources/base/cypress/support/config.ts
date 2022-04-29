import { apiHost as environmentHost } from '../../src/environments/environment';

export const USER_USERNAME = process.env.E2E_USERNAME || 'user';
export const USER_PASSWORD = process.env.E2E_PASSWORD || 'user';

export const ADMIN_USERNAME = process.env.ADMIN_E2E_USERNAME || process.env.E2E_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_E2E_PASSWORD || process.env.E2E_PASSWORD || 'admin';

export const apiHost = process.env.API_HOST || environmentHost.replace(/\/$/, '');
