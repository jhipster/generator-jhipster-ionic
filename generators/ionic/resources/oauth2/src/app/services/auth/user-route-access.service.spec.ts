import { TestBed } from '@angular/core/testing';
import { UserRouteAccessService } from './user-route-access.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('UserRouteAccessService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, IonicStorageModule.forRoot()],
    }),
  );

  it('should be created', () => {
    const service: UserRouteAccessService = TestBed.get(UserRouteAccessService);
    expect(service).toBeTruthy();
  });
});
