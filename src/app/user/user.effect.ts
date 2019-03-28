import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import {
  ActionTypes,
  UserLoadSuccess,
  UserLoadFailure
} from './user.action';
import { UserService } from './user.service';
 
@Injectable()
export class UserEffects {
 
  @Effect()
  loadUsers$ = this.actions$
    .pipe(
      ofType(ActionTypes.Load),
      mergeMap(() => this.userService.getAll()
        .pipe(
          map(users => (new UserLoadSuccess(users))),
          catchError(() => of(new UserLoadFailure()))
        ))
      );
 
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}