import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { TravisNgSharedLibsModule, TravisNgSharedCommonModule, CustomLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
    imports: [TravisNgSharedLibsModule, TravisNgSharedCommonModule],
    declarations: [CustomLoginModalComponent, HasAnyAuthorityDirective],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [CustomLoginModalComponent],
    exports: [TravisNgSharedCommonModule, CustomLoginModalComponent, HasAnyAuthorityDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TravisNgSharedModule {
    static forRoot() {
        return {
            ngModule: TravisNgSharedModule
        };
    }
}
