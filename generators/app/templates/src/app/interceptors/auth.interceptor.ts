import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request || !request.url || (/^http/.test(request.url) && !(ApiService.API_URL && request.url.startsWith(ApiService.API_URL)))) {
      return next.handle(request);
    }

    this.authService.getValidToken().then(token => {
      request = request.clone({
        setHeaders: {
          Authorization: `${token.tokenType} ${token.accessToken}`
        }
      });
    });
    return next.handle(request);
  }
}
