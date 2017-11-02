import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Api } from '../api/api';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountService  {
    constructor(private http: HttpClient) { }

    get(): Observable<any> {
        return this.http.get(Api.API_URL + '/account');
    }

    save(account: any): Observable<Response> {
        return this.http.post(Api.API_URL + '/account', account);
    }
}
