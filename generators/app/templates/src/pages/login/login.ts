import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, Platform, ToastController } from 'ionic-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { TabsPage } from '../tabs/tabs';
import { LoginService } from '../../providers/login/login.service';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    private loginErrorString: string;

    constructor(public navCtrl: NavController, public oauthService: OAuthService,
                public loginService: LoginService,
                public toastCtrl: ToastController,
                public translateService: TranslateService,
                public platform: Platform) {

        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            this.loginErrorString = value;
        });

        if (this.platform.is('core')) {
            this.loginService.redirectLogin();
        } else {
            this.loginService.appLogin((data) => {
                this.navCtrl.push(TabsPage);
            }, (err) => {
                // Unable to log in
                let toast = this.toastCtrl.create({
                    message: this.loginErrorString,
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            });
        }
    }
}
