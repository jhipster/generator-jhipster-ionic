import { Routes } from '@angular/router';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';
import { EntitiesPage } from './entities.page';

export const entitiesRoutes: Routes = [
  {
    path: '',
    component: EntitiesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];
