import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const oauthService = this.injector.get(OAuthService);
        if (oauthService.hasValidAccessToken()) {
            request = request.clone({
                setHeaders: {
                    Authorization: oauthService.authorizationHeader()
                }
            })
        }

        return next.handle(request).do((event: any) => {
            if (event instanceof HttpResponse) {
                return event;
            }
        }).catch(error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    return Observable.of(error);
                }
            }
        });
    }
}
