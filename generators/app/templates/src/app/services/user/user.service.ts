import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public apiService: ApiService) {
  }

  findAll(): Observable<any> {
    return this.apiService.get('users');
  }
}
