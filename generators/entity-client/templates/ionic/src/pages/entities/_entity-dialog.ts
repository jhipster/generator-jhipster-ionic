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
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { <%= entityAngularName %> } from './<%= entityFileName %>.model';
import { <%= entityAngularName %>Service } from './<%= entityFileName %>.provider';

@IonicPage()
@Component({
    selector: 'page-<%= entityFileName %>-dialog',
    templateUrl: '<%= entityFileName %>-dialog.html'
})
export class <%= entityAngularName %>DialogPage {
    //@ViewChild('fileInput') fileInput;

    isReadyToSave: boolean;

    form: FormGroup;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder,
                params: NavParams, private modalCtrl: ModalController) {
        this.form = formBuilder.group({
            id: [params.get('item') ? params.get('item').id : ''],
        <%_ for (idx in fields) {
            const fieldName = fields[idx].fieldName;
            const fieldNameCapitalized = fields[idx].fieldNameCapitalized;
            const fieldNameHumanized = fields[idx].fieldNameHumanized;
            const fieldType = fields[idx].fieldType;
        _%>
            <%= fieldName %>: [params.get('item') ? params.get('item').<%= fieldName %> : '', <% if (fields[idx].fieldValidate === true && fields[idx].fieldValidateRules.indexOf('required') !== -1) { %> Validators.required<% } %>]<% if (idx !== fields.length -1) { %>,<% } %>
        <%_ } _%>
        });

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });
    }

    ionViewDidLoad() {
    }

    /**
     * The user cancelled, dismiss without sending data back.
     */
    cancel() {
        this.viewCtrl.dismiss();
    }

    /**
     * The user is done and wants to create the <%= entityFileName %>, so return it
     * back to the presenter.
     */
    done() {
        if (!this.form.valid) { return; }
        this.viewCtrl.dismiss(this.form.value);
    }
}
