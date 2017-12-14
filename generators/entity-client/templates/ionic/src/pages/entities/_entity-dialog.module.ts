import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { <%= entityAngularName %>DialogPage } from './<%= entityFileName %>-dialog';
import { <%= entityAngularName %>Service } from './<%= entityFileName %>.provider';

@NgModule({
    declarations: [
        <%= entityAngularName %>DialogPage
    ],
    imports: [
        IonicPageModule.forChild(<%= entityAngularName %>DialogPage),
        TranslateModule.forChild()
    ],
    exports: [
        <%= entityAngularName %>DialogPage
    ],
    providers: [<%= entityAngularName %>Service]
})
export class <%= entityAngularName %>DialogPageModule {
}
