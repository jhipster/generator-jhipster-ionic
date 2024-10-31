import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthServerProvider } from './auth-jwt.service';

describe('AuthServerProvider', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );

  it('should be created', () => {
    const service: AuthServerProvider = TestBed.inject(AuthServerProvider);
    expect(service).toBeTruthy();
  });
});
