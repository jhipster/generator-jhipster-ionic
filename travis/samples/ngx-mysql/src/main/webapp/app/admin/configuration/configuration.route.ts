import { Route } from '@angular/router';

import { CustomConfigurationComponent } from './configuration.component';

export const configurationRoute: Route = {
    path: 'custom-configuration',
    component: CustomConfigurationComponent,
    data: {
        pageTitle: 'configuration.title'
    }
};
