import { async, TestBed } from '@angular/core/testing';
import { Config, IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigMock, PlatformMock, SplashScreenMock, StatusBarMock } from 'ionic-mocks-jest';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MyApp } from './app.component';
import { IonicStorageModule, Storage } from '@ionic/storage';

import * as en from '../assets/i18n/en.json';
import { provideSettings } from './app.module';
import { Settings } from '../providers/providers';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { OAuthService } from 'angular-oauth2-oidc';
import { Api } from '../providers/api/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const TRANSLATIONS = {
  EN: en
};

class JsonTranslationLoader implements TranslateLoader {
  getTranslation(code: string = ''): Observable<object> {
    const uppercased = code.toUpperCase();
    return of(TRANSLATIONS[uppercased]);
  }
}

describe('MyApp Component', () => {
  let fixture;
  let component;
  let oauthService = {};

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MyApp],
        imports: [
          IonicModule.forRoot(MyApp),
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: JsonTranslationLoader }
          }),
          HttpClientTestingModule,
          IonicStorageModule.forRoot({
            name: 'storage',
            driverOrder: ['localstorage'],
          })],
        providers: [
          {provide: StatusBar, useFactory: () => StatusBarMock.instance()},
          {provide: SplashScreen, useFactory: () => SplashScreenMock.instance()},
          {provide: Platform, useFactory: () => PlatformMock.instance()},
          {provide: Config, useFactory: () => ConfigMock.instance()},
          {provide: Settings, useFactory: provideSettings, deps: [Storage]},
          {provide: OAuthService, useValue: oauthService},
          Api
        ]
      });
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });

  it('should show tabs page', () => {
    expect(component.rootPage).toEqual('TabsPage');
  });
});
