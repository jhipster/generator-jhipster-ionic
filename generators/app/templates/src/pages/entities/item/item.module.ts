import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ItemPage } from './item';

@NgModule({
  declarations: [
    ItemPage
  ],
  imports: [
    IonicPageModule.forChild(ItemPage),
    TranslateModule.forChild()
  ],
  exports: [
    ItemPage
  ]
})
export class ItemPageModule {
}
