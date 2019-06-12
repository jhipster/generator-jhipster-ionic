import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ApiService } from '../services/api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private servicesEndpoint = ApiService.API_URL.replace('api', 'services');

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    if (!request || !request.url || (/^http/.test(request.url) &&
      !request.url.startsWith(ApiService.API_URL) && !request.url.startsWith(this.servicesEndpoint))) {
      return next.handle(request).toPromise();
    }

    try {
      const token = await this.authService.getValidToken();
      if (!!token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken}`
          }
        });
      }
    } catch (err) {
      // ignore
    }
    return next.handle(request).toPromise();
  }
}
