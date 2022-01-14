import { Injectable } from '@angular/core';
import { Requestor, TokenResponse } from '@openid/appauth';
import { AuthService } from 'ionic-appauth';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  constructor(private requestor: Requestor, private auth: AuthService) {}

  public async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: any) {
    const token: TokenResponse = await this.auth.getValidToken();
    return this.requestor.xhr<T>({
      url,
      method,
      data: JSON.stringify(body),
      headers: this.addHeaders(token),
    });
  }

  private addHeaders(token) {
    return token
      ? {
          Authorization: `${token.tokenType === 'bearer' ? 'Bearer' : token.tokenType} ${token.accessToken}`,
          'Content-Type': 'application/json',
        }
      : {};
  }
}
