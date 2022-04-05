import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { TranslateModule } from '@ngx-translate/core';

describe('UserService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), NgxWebstorageModule.forRoot()],
    })
  );

  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });
});
