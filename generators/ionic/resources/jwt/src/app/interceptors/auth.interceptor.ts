import { HttpInterceptorFn } from '@angular/common/http';
import { ApiService } from '#app/services/api/api.service';

const AUTHENTICATION_TOKEN = 'jhi-authenticationtoken';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const servicesEndpoint = ApiService.API_URL.replace('api', 'services');

  if (
    !req ||
    !req.url ||
    (/^http/.test(req.url) && !req.url.startsWith(ApiService.API_URL) && !req.url.startsWith(servicesEndpoint))
  ) {
    return next(req);
  }

  const token = JSON.parse(localStorage.getItem(AUTHENTICATION_TOKEN) ?? sessionStorage.getItem(AUTHENTICATION_TOKEN));
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
      },
    });
  }
  return next(req);
};
