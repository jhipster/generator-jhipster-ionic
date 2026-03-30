import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './public/coverage',
    },
    server: {
      deps: {
        inline: [/@ionic\/core/, /@stencil\/core/, /@ionic\/angular/, /ionic-appauth/, /@ngrx/, /@ionic-native/, /@ionic\/storage/],
      },
    },
  },
  resolve: {
    alias: {
      '#app': '/src/app',
      'ionicons/components/ion-icon.js': '@ionic/core/components/ion-icon.js',
    },
  },
});
