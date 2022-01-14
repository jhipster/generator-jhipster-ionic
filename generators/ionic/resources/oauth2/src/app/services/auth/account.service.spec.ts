import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AccountService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
    })
  );

  it('should be created', () => {
    const service: AccountService = TestBed.inject(AccountService);
    expect(service).toBeTruthy();
  });
});
