import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';

import { UserRouteAccessService } from './user-route-access.service';

describe('UserRouteAccessService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );

  it('should be created', () => {
    const service: UserRouteAccessService = TestBed.inject(UserRouteAccessService);
    expect(service).toBeTruthy();
  });
});
