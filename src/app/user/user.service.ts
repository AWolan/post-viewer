import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor() { }
  
  getAll(): Observable<User[]> {
    return from(fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json()));
  }

}
