import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Items } from '../../../mocks/providers/items';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  editable: boolean = false;
  clone: any;

  constructor(public navCtrl: NavController, navParams: NavParams, private items: Items) {
    this.item = navParams.get('item') || items.defaultItem;
  }

  edit() {
    this.editable = !this.editable;
    this.clone = {... this.item};
  }

  cancel() {
    this.editable = false;
    this.clone = undefined;
  }

  save() {
    this.items.save(this.clone);
    this.navCtrl.push('ItemPage');
  }
}
