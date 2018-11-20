import { NgModule } from '@angular/core';

import { TravisNgSharedLibsModule, FindLanguageFromKeyPipe, CustomAlertComponent, CustomAlertErrorComponent } from './';

@NgModule({
    imports: [TravisNgSharedLibsModule],
    declarations: [FindLanguageFromKeyPipe, CustomAlertComponent, CustomAlertErrorComponent],
    exports: [TravisNgSharedLibsModule, FindLanguageFromKeyPipe, CustomAlertComponent, CustomAlertErrorComponent]
})
export class TravisNgSharedCommonModule {}
