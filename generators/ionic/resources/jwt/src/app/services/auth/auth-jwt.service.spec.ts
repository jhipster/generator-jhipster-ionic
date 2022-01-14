import { TestBed } from '@angular/core/testing';
import { AuthServerProvider } from './auth-jwt.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxWebstorageModule } from 'ngx-webstorage';

describe('AuthServerProvider', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
    })
  );

  it('should be created', () => {
    const service: AuthServerProvider = TestBed.inject(AuthServerProvider);
    expect(service).toBeTruthy();
  });
});
