import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideHttpClient } from '@angular/common/http';

import { UserRouteAccessService } from './user-route-access.service';

describe('UserRouteAccessService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, IonicStorageModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );

  it('should be created', () => {
    const service: UserRouteAccessService = TestBed.get(UserRouteAccessService);
    expect(service).toBeTruthy();
  });
});
