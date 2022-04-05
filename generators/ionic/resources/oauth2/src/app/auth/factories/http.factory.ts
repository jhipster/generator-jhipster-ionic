import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { CordovaRequestor } from 'ionic-appauth/lib/cordova';
import { NgHttpService } from '../ng-http.service';

export const httpFactory = (platform: Platform, httpClient: HttpClient) => {
  return platform.is('cordova') ? new CordovaRequestor() : new NgHttpService(httpClient);
};
