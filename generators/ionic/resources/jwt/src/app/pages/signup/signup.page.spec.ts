import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPage } from './signup.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot(), RouterTestingModule, NgxWebstorageModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
