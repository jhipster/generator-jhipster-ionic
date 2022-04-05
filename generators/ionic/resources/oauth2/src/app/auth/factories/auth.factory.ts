import { NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageBackend, Requestor } from '@openid/appauth';
import { AuthService, Browser } from 'ionic-appauth';
import { environment } from '../../../environments/environment';
import { App } from '@capacitor/app';

export const authFactory = (platform: Platform, ngZone: NgZone, requestor: Requestor, browser: Browser, storage: StorageBackend) => {
  const authService = new AuthService(browser, storage, requestor);

  if (platform.is('mobile') && !platform.is('mobileweb')) {
    environment.oidcConfig.scopes += ' offline_access';
    environment.oidcConfig.redirect_url = 'dev.localhost.ionic:/callback';
    environment.oidcConfig.end_session_redirect_url = 'dev.localhost.ionic:/logout';
  }
  authService.authConfig = environment.oidcConfig;

  if (platform.is('mobile') && !platform.is('mobileweb')) {
    App.addListener('appUrlOpen', (data: any) => {
      if (data.url !== undefined) {
        ngZone.run(() => {
          if (data.url.indexOf(authService.authConfig.redirect_url) === 0) {
            authService.authorizationCallback(data.url);
          } else {
            authService.endSessionCallback();
          }
        });
      }
    });
  }

  return authService;
};
