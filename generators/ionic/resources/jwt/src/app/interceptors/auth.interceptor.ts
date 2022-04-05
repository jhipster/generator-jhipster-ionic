import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private servicesEndpoint = ApiService.API_URL.replace('api', 'services');

  constructor(private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      !request ||
      !request.url ||
      (/^http/.test(request.url) && !request.url.startsWith(ApiService.API_URL) && !request.url.startsWith(this.servicesEndpoint))
    ) {
      return next.handle(request);
    }

    const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
    if (!!token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }
    return next.handle(request);
  }
}
