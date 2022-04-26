export const userUsername = process.env.E2E_USERNAME || 'user';
export const userPassword = process.env.E2E_PASSWORD || 'user';

export const adminUsername = process.env.ADMIN_E2E_USERNAME || process.env.E2E_USERNAME || 'admin';
export const adminPassword = process.env.ADMIN_E2E_PASSWORD || process.env.E2E_PASSWORD || 'admin';

export const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';
