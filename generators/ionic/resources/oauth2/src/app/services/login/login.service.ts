import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../auth/account.service';
import { AuthService, Browser } from 'ionic-appauth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private accountService: AccountService, private authService: AuthService,
              private translate: TranslateService, private browser: Browser) {}

  login() {
    this.authService
      .signIn()
      .then((data) => {
        this.accountService.identity(true).then((account) => {
          // After the login the language will be changed to
          // the language selected by the user during his registration
          if (account !== null) {
            this.translate.use(account.langKey);
          }
        });
      })
      .catch((error) => {
        console.error(`Sign in error: ${error}`);
      });
  }

  async logout() {
    await this.authService.signOut();
    this.accountService.authenticate(null);

    // Auth0 need special handling since end_session_endpoint is not in oidc-configuration
    const issuer = environment.oidcConfig.server_host;
    if (issuer.includes('auth0.com')) {
      const clientId = environment.oidcConfig.client_id;
      const returnTo = encodeURIComponent(environment.oidcConfig.end_session_redirect_url);
      const logoutUrl = `${issuer}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
      await this.browser.showWindow(logoutUrl, returnTo);
    }
  }
}
