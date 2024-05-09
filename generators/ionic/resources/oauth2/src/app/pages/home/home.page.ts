import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Account } from 'src/model/account.model';
import { AccountService } from '../../services/auth/account.service';
import { LoginService } from '../../services/login/login.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;

  constructor(
    public navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private platform: Platform,
  ) {}

  ngOnInit() {
    this.accountService.identity().then(account => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
      }
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  async logout() {
    await this.loginService.logout();
    this.goBackToHomePage();
    // special handling for Auth0 and Okta; it breaks logout for Keycloak
    if (this.platform.is('capacitor') && !environment.oidcConfig.server_host.includes('jhipster')) {
      window.location.reload(); // enabling fails with Keycloak and iOS
    }
  }

  private goBackToHomePage(): void {
    this.navController.navigateRoot('');
  }
}
