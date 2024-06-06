import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Platform } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'ionic-appauth';

import { AppComponent } from './app.component';

import Mock = jest.Mock;

jest.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setStyle: jest.fn(),
  },
  Style: {
    Default: 'DEFAULT',
  },
}));

jest.mock('@capacitor/splash-screen', () => ({
  SplashScreen: {
    hide: jest.fn(),
  },
}));

const mockedStatusBar = jest.mocked(StatusBar, { shallow: true });
const mockedSplashScreen = jest.mocked(SplashScreen, { shallow: true });

describe('AppComponent', () => {
  let isPluginAvailableSpy;
  let platformReadySpy;
  let platformSpy;
  let authServiceSpy;

  beforeEach(() => {
    isPluginAvailableSpy = jest.spyOn(Capacitor, 'isPluginAvailable');
    platformReadySpy = Promise.resolve();
    platformSpy = createSpyObj('Platform', [{ ready: platformReadySpy }]);
    authServiceSpy = createSpyObj('AuthService', [{ init: Promise.resolve() }]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot(), IonicStorageModule.forRoot()],
      providers: [
        { provide: Platform, useValue: platformSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    isPluginAvailableSpy.mockReset();
    isPluginAvailableSpy.mockRestore();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', fakeAsync(async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    tick();
    expect(isPluginAvailableSpy).toHaveBeenCalled();
    expect(mockedStatusBar.setStyle).not.toHaveBeenCalled();
    expect(mockedSplashScreen.hide).not.toHaveBeenCalled();
  }));

  describe('mocking a device', () => {
    beforeEach(() => {
      isPluginAvailableSpy.mockReturnValue(true);
    });

    it('should call set StatusBar stype', fakeAsync(async () => {
      TestBed.createComponent(AppComponent);
      await platformReadySpy;
      tick();
      expect(mockedStatusBar.setStyle).toHaveBeenCalledWith({ style: Style.Default });
    }));

    it('should call hide splashScreenSpy', async () => {
      TestBed.createComponent(AppComponent);
      await platformReadySpy;
      expect(mockedSplashScreen.hide).toHaveBeenCalled();
    });
  });
  // TODO: add more tests!
});

export const createSpyObj = (baseName, methodNames): { [key: string]: Mock<any> } => {
  const obj: any = {};

  for (const m of methodNames) {
    if (typeof m === 'string') {
      obj[m] = jest.fn();
    } else {
      Object.entries(m).forEach(([key, value]) => {
        obj[key] = jest.fn().mockImplementation(() => value);
      });
    }
  }

  return obj;
};
