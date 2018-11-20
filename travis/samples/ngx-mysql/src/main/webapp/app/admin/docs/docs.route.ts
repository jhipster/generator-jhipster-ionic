import { Route } from '@angular/router';

import { CustomDocsComponent } from './docs.component';

export const docsRoute: Route = {
    path: 'docs',
    component: CustomDocsComponent,
    data: {
        pageTitle: 'global.menu.admin.apidocs'
    }
};
