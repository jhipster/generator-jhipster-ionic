<%#
 Copyright 2013-2018 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see http://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams, ToastController } from 'ionic-angular';
import { <%= entityAngularName %> } from './<%= entityFileName %>.model';
import { <%= entityAngularName %>Service } from './<%= entityFileName %>.provider';

@IonicPage({
    segment: '<%= entityFileName %>-detail/:id'
})
@Component({
    selector: 'page-<%= entityFileName %>-detail',
    templateUrl: '<%= entityFileName %>-detail.html'
})
export class <%= entityAngularName %>DetailPage {
    <%= entityInstance %>: <%= entityAngularName %>;

    constructor(private modalCtrl: ModalController, params: NavParams,
                private <%= entityInstance %>Service: <%= entityAngularName %>Service, private toastCtrl: ToastController) {
        this.<%= entityInstance %> = new <%= entityAngularName %>();
        this.<%= entityInstance %>.id = params.get('id');
    }

    ionViewDidLoad() {
        this.<%= entityInstance %>Service.find(this.<%= entityInstance %>.id).subscribe(data => this.<%= entityInstance %> = data);
    }

    open(item: <%= entityAngularName %>) {
        let modal = this.modalCtrl.create('<%= entityAngularName %>DialogPage', {item: item});
        modal.onDidDismiss(<%= entityInstance %> => {
            if (<%= entityInstance %>) {
                this.<%= entityInstance %>Service.update(<%= entityInstance %>).subscribe(data => {
                    this.<%= entityInstance %> = data;
                    let toast = this.toastCtrl.create(
                        {message: '<%= entityAngularName %> updated successfully.', duration: 3000, position: 'middle'});
                    toast.present();
                }, (error) => console.error(error));
            }
        });
        modal.present();
    }
}
