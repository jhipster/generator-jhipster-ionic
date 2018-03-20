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
    let hasDate = false;
    if (fieldsContainInstant || fieldsContainZonedDateTime || fieldsContainLocalDate) {
        hasDate = true;
    }
_%>
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Api } from '../../../providers/api/api';
<%_ if (hasDate) { _%>
// todo: handle dates
<%_ } _%>

import { <%= entityAngularName %> } from './<%= entityFileName %>.model';

@Injectable()
export class <%= entityAngularName %>Service {
    private resourceUrl = Api.API_URL<% if (locals.microserviceName) { %>.replace('api', '<%= microserviceName.toLowerCase() %>/api')<% } %> + '/<%= entityApiUrl %>';

    constructor(private http: HttpClient) { }
    <%_ if (entityAngularName.length <= 30) { _%>

    create(<%= entityInstance %>: <%= entityAngularName %>): Observable<<%= entityAngularName %>> {
    <%_ } else { _%>

    create(<%= entityInstance %>: <%= entityAngularName %>):
        Observable<<%= entityAngularName %>> {
    <%_ } _%>
        return this.http.post(this.resourceUrl, <%= entityInstance %>);
    }
    <%_ if (entityAngularName.length <= 30) { _%>

    update(<%= entityInstance %>: <%= entityAngularName %>): Observable<<%= entityAngularName %>> {
    <%_ } else { _%>

    update(<%= entityInstance %>: <%= entityAngularName %>):
        Observable<<%= entityAngularName %>> {
    <%_ } _%>
        return this.http.put(this.resourceUrl, <%= entityInstance %>);
    }

    find(id: <% if (pkType === 'String') { %>string<% } else { %>number<% } %>): Observable<<%= entityAngularName %>> {
        return this.http.get(`${this.resourceUrl}/${id}`);
    }

    query(req?: any): Observable<any> {
        return this.http.get(this.resourceUrl);
    }

    delete(id: <% if (pkType === 'String') { %>string<% } else { %>number<% } %>): Observable<any> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response', responseType: 'text' });
    }
}
