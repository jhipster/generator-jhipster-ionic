import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { EntityPage } from './entity';

@NgModule({
  declarations: [
    EntityPage
    /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
  ],
  imports: [
    IonicPageModule.forChild(EntityPage),
    TranslateModule.forChild()
  ],
  exports: [EntityPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EntityPageModule {
}
