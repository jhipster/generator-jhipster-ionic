import { Injectable } from '@angular/core';
import { Requestor } from '@openid/appauth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { XhrSettings } from 'ionic-appauth/lib/cordova';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgHttpService implements Requestor {
  constructor(private http: HttpClient) {}

  public async xhr<T>(settings: XhrSettings): Promise<T> {
    if (!settings.method) {
      settings.method = 'GET';
    }

    switch (settings.method) {
      case 'GET':
        return firstValueFrom(this.http.get<T>(settings.url, {headers: this.getHeaders(settings.headers)}));
      case 'POST':
        return firstValueFrom(this.http.post<T>(settings.url, settings.data, {headers: this.getHeaders(settings.headers)}));
      case 'PUT':
        return firstValueFrom(this.http.put<T>(settings.url, settings.data, {headers: this.getHeaders(settings.headers)}));
      case 'DELETE':
        return firstValueFrom(this.http.delete<T>(settings.url, {headers: this.getHeaders(settings.headers)}));
    }
  }

  private getHeaders(headers: any): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();

    if (headers !== undefined) {
      Object.keys(headers).forEach((key) => {
        httpHeaders = httpHeaders.append(key, headers[key]);
      });
    }

    return httpHeaders;
  }
}
