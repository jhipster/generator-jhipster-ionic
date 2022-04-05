import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthActions, IAuthAction, AuthService } from 'ionic-appauth';
import { Subscription } from 'rxjs';

@Component({
  template: '<p style="margin-left: 10px">Authorizing...</p>',
})
export class AuthCallbackPage implements OnInit, OnDestroy {
  sub: Subscription;

  constructor(private auth: AuthService, private navCtrl: NavController, private router: Router) {}

  ngOnInit() {
    this.sub = this.auth.events$.subscribe((action) => this.postCallback(action));
    this.auth.authorizationCallback(window.location.origin + this.router.url);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async postCallback(action: IAuthAction) {
    if (action.action === AuthActions.SignInSuccess) {
      await this.navCtrl.navigateRoot('tabs');
    }

    if (action.action === AuthActions.SignInFailed) {
      await this.navCtrl.navigateRoot('login');
    }
  }
}
