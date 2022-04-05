import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'ionic-appauth';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private navCtrl: NavController) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.auth.initComplete$.pipe(
      filter((complete) => complete),
      switchMap(() => this.auth.isAuthenticated$),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.navCtrl.navigateRoot('login');
        }
      })
    );
  }
}
