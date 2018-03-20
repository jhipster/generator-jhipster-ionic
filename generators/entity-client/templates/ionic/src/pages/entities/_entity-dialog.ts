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
<%_
const query = generateEntityQueries(relationships, entityInstance, dto);
const queries = query.queries;
const variables = query.variables;
let hasManyToMany = query.hasManyToMany;
_%>
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { <%= entityAngularName %> } from './<%= entityFileName %>.model';
import { <%= entityAngularName %>Service } from './<%= entityFileName %>.provider';
<%_
let hasRelationshipQuery = false;
Object.keys(differentRelationships).forEach(key => {
    const hasAnyRelationshipQuery = differentRelationships[key].some(rel =>
        (rel.relationshipType === 'one-to-one' && rel.ownerSide === true && rel.otherEntityName !== 'user')
        || rel.relationshipType !== 'one-to-many'
    );
    if (hasAnyRelationshipQuery) {
        hasRelationshipQuery = true;
    }
    if (differentRelationships[key].some(rel => rel.relationshipType !== 'one-to-many')) {
        const uniqueRel = differentRelationships[key][0];
        if (uniqueRel.otherEntityAngularName === 'User') { _%>
import { User } from '../../../models/user.model';
import { User as UserService } from '../../../providers/user/user';
    <%_ } else if (uniqueRel.otherEntityAngularName !== entityAngularName) { _%>
import { <%= uniqueRel.otherEntityAngularName %>, <%= uniqueRel.otherEntityAngularName%>Service } from '../<%= uniqueRel.otherEntityModulePath %>';
    <%_}
    }
}); _%>

@IonicPage()
@Component({
    selector: 'page-<%= entityFileName %>-dialog',
    templateUrl: '<%= entityFileName %>-dialog.html'
})
export class <%= entityAngularName %>DialogPage {

    <%= entityInstance %>: <%= entityAngularName %>;
    <%_ for (const idx in variables) { _%>
    <%- variables[idx] %>
    <%_ } _%>
    isReadyToSave: boolean;

    form: FormGroup;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController,
                formBuilder: FormBuilder, params: NavParams,
    <%_ Object.keys(differentRelationships).forEach(key => {
            if (differentRelationships[key].some(rel => rel.relationshipType !== 'one-to-many')) {
                const uniqueRel = differentRelationships[key][0];
                if (uniqueRel.otherEntityAngularName !== entityAngularName) { _%>
                private <%= uniqueRel.otherEntityName %>Service: <%= uniqueRel.otherEntityAngularName %>Service,
                <%_
                }
            }
        });
    _%>
                private <%= entityInstance %>Service: <%= entityAngularName %>Service) {
        this.<%= entityInstance %> = params.get('item');
        if (this.<%= entityInstance %> && this.<%= entityInstance %>.id) {
            this.<%= entityInstance %>Service.find(this.<%= entityInstance %>.id).subscribe(data => {
                this.<%= entityInstance %> = data;
            });
        }

        this.form = formBuilder.group({
            id: [params.get('item') ? this.<%= entityInstance %>.id : null],
        <%_ for (idx in fields) {
            const fieldName = fields[idx].fieldName;
            const fieldNameCapitalized = fields[idx].fieldNameCapitalized;
            const fieldNameHumanized = fields[idx].fieldNameHumanized;
            const fieldType = fields[idx].fieldType;
        _%>
            <%= fieldName %>: [params.get('item') ? this.<%= entityInstance %>.<%= fieldName %> : '', <% if (fields[idx].fieldValidate === true && fields[idx].fieldValidateRules.indexOf('required') !== -1) { %> Validators.required<% } %>],
        <%_ } _%>
    <%_ Object.keys(differentRelationships).forEach(key => {
        if (differentRelationships[key].some(rel => rel.relationshipType !== 'one-to-many')) {
            const uniqueRel = differentRelationships[key][0];
            const relatedFieldName = (uniqueRel.relationshipType === 'many-to-many') ?
                uniqueRel.otherEntityNamePlural : uniqueRel.otherEntityName;
            if (uniqueRel.otherEntityAngularName !== entityAngularName) { _%>
            <%= relatedFieldName %>: [params.get('item') ? this.<%= entityInstance %>.<%= relatedFieldName %> : '', <%_ if (uniqueRel.relationshipValidate === true) { _%> Validators.required <%_ } _%>],
            <%_ }
        }
    });
    _%>
        });

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });
    }

    ionViewDidLoad() {
    <%_ for (idx in queries) {
        if (queries[idx].indexOf('userService') > -1) { _%>
        this.userService.findAll().subscribe(data => this.users = data, (error) => this.onError(error));
        <%_ } else { _%>
        <%- queries[idx] %>
    <%_ } } _%>
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

    onError(error) {
        console.error(error);
        let toast = this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
        toast.present();
    }

    <%_
    const entitiesSeen = [];
    for (idx in relationships) {
        const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
        if(relationships[idx].relationshipType !== 'one-to-many' && !entitiesSeen.includes(otherEntityNameCapitalized)) {
    _%>
    compare<%- otherEntityNameCapitalized -%>(first: <%- relationships[idx].otherEntityAngularName -%>, second: <%- relationships[idx].otherEntityAngularName -%>): boolean {
        return first && second ? first.id === second.id : first === second;
    }

    track<%- otherEntityNameCapitalized -%>ById(index: number, item: <%- relationships[idx].otherEntityAngularName -%>) {
        return item.id;
    }
    <%_ entitiesSeen.push(otherEntityNameCapitalized); } } _%>
}
