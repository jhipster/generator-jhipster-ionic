import { apiHost as environmentHost } from '../../src/environments/environment';

export const userUsername = process.env.E2E_USERNAME || 'user';
export const userPassword = process.env.E2E_PASSWORD || 'user';

export const adminUsername = process.env.ADMIN_E2E_USERNAME || process.env.E2E_USERNAME || 'admin';
export const adminPassword = process.env.ADMIN_E2E_PASSWORD || process.env.E2E_PASSWORD || 'admin';

export const apiHost = process.env.API_HOST || environmentHost.replace(/\/$/, '');
