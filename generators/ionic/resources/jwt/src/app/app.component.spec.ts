import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

import { Mock } from 'vitest';

describe('AppComponent', () => {
  let isPluginAvailableSpy;
  let platformReadySpy;
  let platformSpy;

  beforeEach(() => {
    isPluginAvailableSpy = vi.spyOn(Capacitor, 'isPluginAvailable').mockReturnValue(false);
    platformReadySpy = Promise.resolve();
    platformSpy = createSpyObj('Platform', [{ ready: platformReadySpy }]);
    platformSpy.backButton = { subscribeWithPriority: vi.fn() };

    TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: Platform, useValue: platformSpy }, provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    isPluginAvailableSpy.mockReset();
    isPluginAvailableSpy.mockRestore();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
  });
  // TODO: add more tests!
});

export const createSpyObj = (baseName, methodNames): { [key: string]: Mock<any> } => {
  const obj: any = {};

  for (const m of methodNames) {
    if (typeof m === 'string') {
      obj[m] = vi.fn();
    } else {
      Object.entries(m).forEach(([key, value]) => {
        obj[key] = vi.fn().mockImplementation(() => value);
      });
    }
  }

  return obj;
};
