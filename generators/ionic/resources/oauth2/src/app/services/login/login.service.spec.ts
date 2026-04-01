import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService, Browser } from 'ionic-appauth';
import { Subject } from 'rxjs';
import { LoginService } from './login.service';

describe('LoginService', () => {
  const mockAuthService = {
    signIn: vi.fn().mockResolvedValue({}),
    signOut: vi.fn().mockResolvedValue({}),
    events$: new Subject(),
  };

  const mockBrowser = {
    showWindow: vi.fn().mockResolvedValue({}),
    closeWindow: vi.fn().mockResolvedValue({}),
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), IonicStorageModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Browser, useValue: mockBrowser },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }),
  );

  it('should be created', () => {
    const service: LoginService = TestBed.inject(LoginService);
    expect(service).toBeTruthy();
  });
});
