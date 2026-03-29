import { Routes } from '@angular/router';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
        data: {
          authorities: ['ROLE_USER'],
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'entities',
        loadChildren: () => import('./pages/entities/entities.module').then(m => m.entitiesRoutes),
      },
      {
        path: 'account',
        loadComponent: () => import('./pages/account/account.page').then(m => m.AccountPage),
        data: {
          authorities: ['ROLE_USER'],
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'callback',
    loadComponent: () => import('./auth/auth-callback/auth-callback.page').then(m => m.AuthCallbackPage),
  },
  {
    path: 'logout',
    loadComponent: () => import('./auth/end-session/end-session.page').then(m => m.EndSessionPage),
  },
  { path: 'accessdenied', redirectTo: '', pathMatch: 'full' },
];
