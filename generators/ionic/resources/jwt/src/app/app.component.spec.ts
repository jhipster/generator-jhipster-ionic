import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import Mock = jest.Mock;
import { TranslateModule } from '@ngx-translate/core';

describe('AppComponent', () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(async(() => {
    statusBarSpy = createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = createSpyObj('Platform', [{ ready: platformReadySpy }]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!
});

export const createSpyObj = (baseName, methodNames): { [key: string]: Mock<any> } => {
  const obj: any = {};

  for (const m of methodNames) {
    if (typeof m === 'string') {
      obj[m] = jest.fn();
    } else {
      obj[Object.keys(m)[0]] = jest.fn().mockImplementation(() => Object.values(m)[0]);
    }
  }

  return obj;
};
