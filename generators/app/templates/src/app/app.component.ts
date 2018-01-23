import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { MainPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { Api } from '../providers/api/api';

@Component({
    template: `
    <ion-menu [content]="content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Pages</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-list>
          <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
            {{p.title}}
          </button>
        </ion-list>
      </ion-content>

    </ion-menu>
    <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage = MainPage;

    @ViewChild(Nav) nav: Nav;

    pages: any[] = [
        {title: 'Welcome', component: 'WelcomePage'},
        {title: 'Tabs', component: 'TabsPage'},
        {title: 'Login', component: 'LoginPage'},
        {title: 'Signup', component: 'SignupPage'},
        {title: 'Menu', component: 'MenuPage'},
        {title: 'Settings', component: 'SettingsPage'},
        {title: 'Entities', component: 'EntityPage'}
    ];

    constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config,
                private statusBar: StatusBar, private splashScreen: SplashScreen, oauthService: OAuthService, api: Api) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        this.initTranslate();

        // Try to get the oauth settings from the server
        api.get('auth-info').subscribe((data: any) => {
                data.redirectUri = 'http://localhost:8100';
                oauthService.configure(data);
                oauthService.tokenValidationHandler = new JwksValidationHandler();
                oauthService.loadDiscoveryDocumentAndTryLogin().catch(error => {
                    if (error.params.error === 'unsupported_response_type') {
                        let problem = 'You need to enable implicit flow for this app in your identity provider!';
                        problem += '\nError from IdP: ' + error.params.error_description.replace(/\+/g, ' ');
                        console.error(problem);
                    }
                })
            }, error => {
                console.error('ERROR fetching authentication information, defaulting to Keycloak settings');
                oauthService.redirectUri = 'http://localhost:8100';
                oauthService.clientId = 'web_app';
                oauthService.scope = 'openid profile email';
                oauthService.issuer = 'http://localhost:9080/auth/realms/jhipster';
            }
        );
    }

    initTranslate() {
        // Set the default language for translation strings, and the current language.
        this.translate.setDefaultLang('en');

        if (this.translate.getBrowserLang() !== undefined) {
            this.translate.use(this.translate.getBrowserLang());
        } else {
            this.translate.use('en'); // Set your language here
        }

        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
