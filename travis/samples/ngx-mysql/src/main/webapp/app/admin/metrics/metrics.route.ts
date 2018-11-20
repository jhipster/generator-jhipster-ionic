import { Route } from '@angular/router';

import { CustomMetricsMonitoringComponent } from './metrics.component';

export const metricsRoute: Route = {
    path: 'custom-metrics',
    component: CustomMetricsMonitoringComponent,
    data: {
        pageTitle: 'metrics.title'
    }
};
