import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { <%= entityAngularName %>DetailPage } from './<%= entityFileName %>-detail';
import { <%= entityAngularName %>Service } from './<%= entityFileName %>.provider';

@NgModule({
    declarations: [
        <%= entityAngularName %>DetailPage
    ],
    imports: [
        IonicPageModule.forChild(<%= entityAngularName %>DetailPage),
        TranslateModule.forChild()
    ],
    exports: [
        <%= entityAngularName %>DetailPage
    ],
    providers: [<%= entityAngularName %>Service]
})
export class <%= entityAngularName %>DetailPageModule {
}
