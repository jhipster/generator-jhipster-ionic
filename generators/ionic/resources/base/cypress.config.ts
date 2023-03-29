import { defineConfig } from 'cypress';

export const defaultConfig = {
  video: false,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  downloadsFolder: 'cypress/downloads',
  videosFolder: 'cypress/videos',
  viewportWidth: 1200,
  viewportHeight: 720,
  retries: 2,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    async setupNodeEvents(on, config) {
      return (await import('./cypress/plugins/index')).default(on, config);
    },
    baseUrl: 'http://localhost:8100/',
    supportFile: 'cypress/support/index.ts',
    experimentalSessionAndOrigin: true,
  },
};

export default defineConfig(defaultConfig);
