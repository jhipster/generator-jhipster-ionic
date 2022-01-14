import { TestBed } from '@angular/core/testing';
import { UserRouteAccessService } from './user-route-access.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxWebstorageModule } from 'ngx-webstorage';

describe('UserRouteAccessService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, NgxWebstorageModule.forRoot()],
    })
  );

  it('should be created', () => {
    const service: UserRouteAccessService = TestBed.inject(UserRouteAccessService);
    expect(service).toBeTruthy();
  });
});
