import { APP_INITIALIZER, ApplicationConfig, NgZone } from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { Platform, IonicRouteStrategy } from '@ionic/angular';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { Requestor, StorageBackend } from '@openid/appauth';
import { AuthService, Browser } from 'ionic-appauth';
import { authFactory, browserFactory, httpFactory, storageFactory } from './auth/factories';
import { AuthConfigService } from './auth/auth-config.service';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const authInitializer = (authConfig: AuthConfigService) => {
  return () => {
    return authConfig.loadAuthConfig();
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    importProvidersFrom(IonicStorageModule.forRoot()),
    {
      provide: StorageBackend,
      useFactory: storageFactory,
      deps: [Platform],
    },
    {
      provide: Requestor,
      useFactory: httpFactory,
      deps: [Platform, HttpClient],
    },
    {
      provide: Browser,
      useFactory: browserFactory,
      deps: [Platform],
    },
    {
      provide: AuthService,
      useFactory: authFactory,
      deps: [Platform, NgZone, Requestor, Browser, StorageBackend],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      multi: true,
      deps: [AuthConfigService],
    },
  ],
};
