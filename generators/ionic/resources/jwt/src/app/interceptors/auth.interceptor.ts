import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '#app/services/api/api.service';

const AUTHENTICATION_TOKEN = 'jhi-authenticationtoken';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private servicesEndpoint = ApiService.API_URL.replace('api', 'services');

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      !request ||
      !request.url ||
      (/^http/.test(request.url) && !request.url.startsWith(ApiService.API_URL) && !request.url.startsWith(this.servicesEndpoint))
    ) {
      return next.handle(request);
    }

    const token = JSON.parse(localStorage.getItem(AUTHENTICATION_TOKEN) ?? sessionStorage.getItem(AUTHENTICATION_TOKEN));
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }
    return next.handle(request);
  }
}
