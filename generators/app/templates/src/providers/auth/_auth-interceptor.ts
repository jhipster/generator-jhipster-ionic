import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { NavController } from 'ionic-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
    if (!!token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        return event;
      }
    }).catch(error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          return Observable.create(error);
        }
      }
    });
  }
}
