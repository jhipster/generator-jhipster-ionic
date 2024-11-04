import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { share } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: any;

  constructor(
    public apiService: ApiService,
    public loginService: LoginService,
  ) {}

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    this.loginService
      .login(accountInfo)
      .then(res => {
        this.loggedIn(res);
        return of(res);
      })
      .catch(err => {
        console.error('ERROR', err);
        return throwError(err);
      });
  }

  findAll(): Observable<any> {
    return this.apiService.get('users');
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    return this.apiService.post('register', accountInfo, { responseType: 'text' as const }).pipe(share());
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.loginService.logout();
    this.user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  private loggedIn(resp) {
    this.user = resp.user;
  }
}
