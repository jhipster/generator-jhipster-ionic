import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthConfigService {
  private authConfig;

  constructor(private http: HttpClient) {}

  loadAuthConfig() {
    return this.http
      .get(`${environment.apiUrl}/auth-info`)
      .toPromise()
      .then((data) => {
        this.authConfig = data;
        // Override issuer and client ID with values from API
        environment.oidcConfig.server_host = this.authConfig.issuer;
        environment.oidcConfig.client_id = this.authConfig.clientId;
      })
      .catch((error) => {
        console.error('Failed to fetch remote OIDC configuration.');
        console.error(error);
      });
  }

  getConfig() {
    return this.authConfig;
  }
}
