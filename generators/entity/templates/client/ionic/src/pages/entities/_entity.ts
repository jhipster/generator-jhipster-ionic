<%#
 Copyright 2013-2017 the original author or authors from the JHipster project.

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
import { IonicPage, ModalController, NavController, ToastController } from 'ionic-angular';
import { <%= entityAngularName %> } from './<%= entityFileName %>.model';
import { <%= entityAngularName %>Service } from './<%= entityFileName %>.provider';

@IonicPage()
@Component({
    selector: 'page-<%= entityFileName %>',
    templateUrl: '<%= entityFileName %>.html'
})
export class <%= entityAngularName %>Page {
    <%= entityInstancePlural %>: <%= entityAngularName %>[];

    // todo: add pagination

    constructor(private navCtrl: NavController, private <%= entityInstance %>Service: <%= entityAngularName %>Service,
                private modalCtrl: ModalController, private toastCtrl: ToastController) {
        this.<%= entityInstancePlural %> = [];
    }

    ionViewDidLoad() {
        this.loadAll();
    }

    loadAll() {
        this.<%= entityInstance %>Service.query().subscribe(
            (response) => this.onSuccess(response),
            (error) => this.onError(error));
    }

    private onSuccess(data) {
        this.products = data;
    }

    private onError(error) {
        console.error(error);
        // todo: use toaster, this.jhiAlertService.error(error.message, null, null);
    }

    trackId(index: number, item: <%= entityAngularName %>) {
        return item.id;
    }

    add() {
        let addModal = this.modalCtrl.create('<%= entityAngularName %>DialogPage');
        addModal.onDidDismiss(<%= entityInstance %> => {
            if (<%= entityInstance %>) {
                this.<%= entityInstance %>Service.create(<%= entityInstance %>).subscribe(data => {
                    this.<%= entityInstancePlural %>.push(data);
                    let toast = this.toastCtrl.create({
                        message: '<%= entityAngularName %> added successfully.',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                }, (error) => console.error(error));
            }
        });
        addModal.present();
    }

    delete(<%= entityInstance %>) {
        this.<%= entityInstance %>Service.delete(<%= entityInstance %>.id).subscribe(() => {
            let toast = this.toastCtrl.create({
                message: '<%= entityAngularName %> deleted successfully.',
                duration: 3000,
                position: 'top',
            });
            toast.present();
            this.loadAll();
        }, (error) => console.error(error));
    }

    open(<%= entityInstance %>: <%= entityAngularName %>) {
        this.navCtrl.push('<%= entityAngularName %>DetailPage', {
            <%= entityInstance %>: <%= entityInstance %>
        });
    }
}
