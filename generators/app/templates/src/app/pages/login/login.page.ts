import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthActions, IAuthAction } from 'ionic-appauth';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  action: IAuthAction;

  constructor(private authService: AuthService, private navCtrl: NavController) {
  }

  ngOnInit() {
    this.authService.authObservable.subscribe((action) => {
      this.action = action;
      if (action.action === AuthActions.SignInSuccess) {
        this.navCtrl.navigateRoot('tabs');
      }
    });
  }

  signIn() {
    this.authService.signIn();
  }
}
