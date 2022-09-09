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
      .then(data => {
        this.authConfig = data;
        if (this.authConfig.issuer.endsWith('/')) {
          this.authConfig.issuer = this.authConfig.issuer.substring(0, this.authConfig.issuer.length - 1);
        }
        // Override issuer with value from API. Client ID is configured in environment.
        environment.oidcConfig.server_host = this.authConfig.issuer;
      })
      .catch(error => {
        console.error('Failed to fetch remote OIDC configuration.');
        console.error(error);
      });
  }

  getConfig() {
    return this.authConfig;
  }
}
