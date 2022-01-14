import { Platform } from '@ionic/angular';
import { CapacitorStorage } from 'ionic-appauth/lib/capacitor';
import { CordovaSecureStorage } from 'ionic-appauth/lib/cordova';

export let storageFactory = (platform: Platform) => {
  return platform.is('cordova') ? new CordovaSecureStorage() : new CapacitorStorage();
};
