import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../auth/account.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  login() {
    this.authService.signIn().then(data => {
      this.accountService.identity(true).then(account => {
        // After the login the language will be changed to
        // the language selected by the user during his registration
        if (account !== null) {
          this.translate.use(account.langKey);
        }
      });
    }).catch(error => {
      console.error(`Sign in error: ${error}`);
    });
  }

  logout() {
    this.authService.signOut();
    this.accountService.authenticate(null);
  }
}
