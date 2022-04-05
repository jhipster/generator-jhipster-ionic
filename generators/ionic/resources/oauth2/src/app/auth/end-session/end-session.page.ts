import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'ionic-appauth';

@Component({
  template: '<p style="margin-left: 10px">Signing out...</p>',
})
export class EndSessionPage implements OnInit {
  constructor(private auth: AuthService, private navCtrl: NavController) {}

  async ngOnInit() {
    this.auth.endSessionCallback();
    await this.navCtrl.navigateRoot('login');
  }
}
