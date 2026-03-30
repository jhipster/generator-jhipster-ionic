import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vitest-angular/plugin';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/polyfills.ts'],
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
