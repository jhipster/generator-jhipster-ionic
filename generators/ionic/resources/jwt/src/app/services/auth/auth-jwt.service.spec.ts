import { TestBed } from '@angular/core/testing';
import { AuthServerProvider } from './auth-jwt.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthServerProvider', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: AuthServerProvider = TestBed.inject(AuthServerProvider);
    expect(service).toBeTruthy();
  });
});
