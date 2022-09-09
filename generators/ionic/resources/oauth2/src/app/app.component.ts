import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'ionic-appauth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(private platform: Platform, private translate: TranslateService, private authService: AuthService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await this.authService.init();
      if (Capacitor.isPluginAvailable('StatusBar')) {
        await StatusBar.setStyle({ style: Style.Default });
      }
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        await SplashScreen.hide();
      }
    });
    this.initTranslate();
  }

  initTranslate() {
    const enLang = 'en';

    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(enLang);

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use(enLang); // Set your language here
    }
  }
}
