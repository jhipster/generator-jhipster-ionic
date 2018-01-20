import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class User {

    constructor(public api: Api) { }

    findAll(): Observable<any> {
        return this.api.get('users');
    }
}
