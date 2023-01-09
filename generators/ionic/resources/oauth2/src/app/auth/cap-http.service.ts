import { Injectable } from '@angular/core';
import { Requestor } from '@openid/appauth';
import { Http, HttpResponse } from '@capacitor-community/http';
import { XhrSettings } from 'ionic-appauth/lib/cordova';

@Injectable({
  providedIn: 'root',
})
export class CapacitorHttpService implements Requestor {
  public async xhr<T>(settings: XhrSettings): Promise<T> {
    if (!settings.method) {
      settings.method = 'GET';
    }

    const response: HttpResponse = await Http.request({
      method: settings.method,
      url: settings.url,
      headers: settings.headers,
      data: settings.data,
    });
    return response.data as T;
  }
}
