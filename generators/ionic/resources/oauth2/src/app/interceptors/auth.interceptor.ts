import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '#app/services/api/api.service';
import { AuthService } from 'ionic-appauth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const servicesEndpoint = ApiService.API_URL.replace('api', 'services');

  // prettier-ignore
  if (!req || !req.url || (/^http/.test(req.url) &&
    !req.url.startsWith(ApiService.API_URL) && !req.url.startsWith(servicesEndpoint))) {
    return next(req);
  }

  return from(authService.getValidToken().catch(() => null)).pipe(
    switchMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
      }
      return next(req);
    }),
  );
};
