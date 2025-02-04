import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '#app/services/user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  // The account fields for the signup form
  account: {
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    langKey: string;
  } = {
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    langKey: 'en',
  };

  // Our translated text strings
  private signupErrorString!: string;
  private signupSuccessString!: string;
  private existingUserError!: string;
  private invalidPasswordError!: string;

  constructor(
    public navController: NavController,
    public userService: UserService,
    public toastController: ToastController,
    public translateService: TranslateService,
  ) {
    this.translateService.get(['SIGNUP_ERROR', 'SIGNUP_SUCCESS', 'EXISTING_USER_ERROR', 'INVALID_PASSWORD_ERROR']).subscribe(values => {
      this.signupErrorString = values.SIGNUP_ERROR;
      this.signupSuccessString = values.SIGNUP_SUCCESS;
      this.existingUserError = values.EXISTING_USER_ERROR;
      this.invalidPasswordError = values.INVALID_PASSWORD_ERROR;
    });
  }

  doSignup() {
    // set login to same as email
    this.account.login = this.account.email;
    // Attempt to login in through our User service
    this.userService.signup(this.account).subscribe(
      async () => {
        const toast = await this.toastController.create({
          message: this.signupSuccessString,
          duration: 3000,
          position: 'top',
        });
        toast.present();
      },
      async response => {
        // Unable to sign up
        const error = JSON.parse(response.error);
        let displayError = this.signupErrorString;
        if (response.status === 400 && error.type.includes('already-used')) {
          displayError = this.existingUserError;
        } else if (
          response.status === 400 &&
          error.message === 'error.validation' &&
          error.fieldErrors[0].field === 'password' &&
          error.fieldErrors[0].message === 'Size'
        ) {
          displayError = this.invalidPasswordError;
        }
        const toast = await this.toastController.create({
          message: displayError,
          duration: 3000,
          position: 'middle',
        });
        toast.present();
      },
    );
  }
}
