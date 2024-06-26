import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthActions, AuthService, IAuthAction } from 'ionic-appauth';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

const { audience } = environment;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  action: IAuthAction;
  sub: Subscription;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
  ) {}

  async ngOnInit() {
    this.sub = this.authService.events$.subscribe(action => this.onSignInSuccess(action));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public async signIn() {
    await this.authService.signIn({ audience });
  }

  private async onSignInSuccess(action: IAuthAction) {
    this.action = action;
    if (action.action === AuthActions.SignInSuccess || action.action === AuthActions.LoadTokenFromStorageSuccess) {
      await this.navCtrl.navigateRoot('tabs');
    }
  }
}
