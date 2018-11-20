import { Route } from '@angular/router';

import { CustomHealthCheckComponent } from './health.component';

export const healthRoute: Route = {
    path: 'custom-health',
    component: CustomHealthCheckComponent,
    data: {
        pageTitle: 'health.title'
    }
};
