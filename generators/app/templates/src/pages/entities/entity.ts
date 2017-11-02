import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-entity',
  templateUrl: 'entity.html'
})
export class EntityPage {

  entities: Array<any> = [{name: 'Item', component: 'ItemPage'}];

  constructor(public nav: NavController) { }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}
