import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '#app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // The account fields for the login form.
  account: { username: string; password: string; rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: false,
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(
    public translateService: TranslateService,
    public loginService: LoginService,
    public toastController: ToastController,
    public navController: NavController,
  ) {}

  ngOnInit() {
    this.translateService.get('LOGIN_ERROR').subscribe(value => {
      this.loginErrorString = value;
    });
  }

  doLogin() {
    this.loginService.login(this.account).then(
      () => {
        this.navController.navigateRoot('/tabs');
      },
      async err => {
        // Unable to log in
        this.account.password = '';
        const toast = await this.toastController.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top',
        });
        toast.present();
      },
    );
  }
}
