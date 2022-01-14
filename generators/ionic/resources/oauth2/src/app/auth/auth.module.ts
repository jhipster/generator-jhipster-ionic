import { NgModule, NgZone, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Requestor, StorageBackend } from '@openid/appauth';
import { authFactory, browserFactory, httpFactory, storageFactory } from './factories';
import { AuthService, Browser } from 'ionic-appauth';
import { AuthConfigService } from './auth-config.service';

const authInitializer = (authConfig: AuthConfigService) => {
  return () => {
    return authConfig.loadAuthConfig();
  };
};

@NgModule({
  imports: [CommonModule],
  providers: [
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
})
export class AuthModule {}
