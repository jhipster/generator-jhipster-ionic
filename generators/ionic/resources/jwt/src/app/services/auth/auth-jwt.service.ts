import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';

const AUTHENTICATION_TOKEN = 'jhi-authenticationtoken';

@Injectable({
  providedIn: 'root',
})
export class AuthServerProvider {
  constructor(private http: HttpClient) {}

  getToken() {
    return JSON.parse(localStorage.getItem(AUTHENTICATION_TOKEN) ?? sessionStorage.getItem(AUTHENTICATION_TOKEN));
  }

  login(credentials): Observable<any> {
    const data = {
      username: credentials.username,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    };

    return this.http.post(ApiService.API_URL + '/authenticate', data, { observe: 'response' }).pipe(map(authenticateSuccess.bind(this)));

    function authenticateSuccess(resp) {
      const bearerToken = resp.headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwt = bearerToken.slice(7, bearerToken.length);
        this.storeAuthenticationToken(jwt, credentials.rememberMe);
        return jwt;
      }
    }
  }

  loginWithToken(jwt, rememberMe) {
    if (jwt) {
      this.storeAuthenticationToken(jwt, rememberMe);
      return Promise.resolve(jwt);
    } else {
      return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
    }
  }

  storeAuthenticationToken(jwt, rememberMe) {
    jwt = JSON.stringify(jwt);
    if (rememberMe) {
      localStorage.setItem(AUTHENTICATION_TOKEN, jwt);
    } else {
      sessionStorage.setItem(AUTHENTICATION_TOKEN, jwt);
    }
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      localStorage.removeItem(AUTHENTICATION_TOKEN);
      sessionStorage.removeItem(AUTHENTICATION_TOKEN);
      observer.complete();
    });
  }
}
