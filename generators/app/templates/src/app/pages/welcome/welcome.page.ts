import { Component, OnInit } from '@angular/core';
import { AuthActions } from 'ionic-appauth';
import { AuthService } from '../../auth/auth.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss']
})
export class WelcomePage implements OnInit {

  constructor(private authService: AuthService, private navController: NavController, private router: Router) {}

  ngOnInit() {
    this.authService.authObservable.subscribe((action) => {
      if (action.action === AuthActions.SignInSuccess || action.action === AuthActions.AutoSignInSuccess) {
        console.log('action', action);
        this.navController.navigateRoot('/tabs');
      } else if (action.action === AuthActions.SignOutSuccess) {
        // do nothing
      }
    });

    // todo: figure out why access denied is happening
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        // console.log('url', e.url);
      }
    });
  }

  signIn() {
    this.authService.signIn().catch(error => console.error(`Sign in error: ${error}`));
  }
}
