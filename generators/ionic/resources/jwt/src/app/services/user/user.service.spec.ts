import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('UserService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }),
  );

  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });
});
