import { Platform } from '@ionic/angular';
import { CordovaBrowser } from 'ionic-appauth/lib/cordova';
import { CapacitorBrowser } from 'ionic-appauth/lib/capacitor';

export const browserFactory = (platform: Platform) => {
  return platform.is('cordova') ? new CordovaBrowser() : new CapacitorBrowser();
};
