import { TestBed } from '@angular/core/testing';
import { UserRouteAccessService } from './user-route-access.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2Webstorage } from 'ngx-webstorage';
import { IonicStorageModule } from '@ionic/storage';

describe('UserRouteAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule, Ng2Webstorage.forRoot(), IonicStorageModule.forRoot()]
  }));

  it('should be created', () => {
    const service: UserRouteAccessService = TestBed.get(UserRouteAccessService);
    expect(service).toBeTruthy();
  });
});
