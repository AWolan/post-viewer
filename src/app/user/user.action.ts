import { Action } from '@ngrx/store';

import { User } from './user.interface';

export enum ActionTypes {
  Load = '[User] Load',
  LoadSuccess = '[User] Load Success',
  LoadFailure = '[User] Load Failure',
  Select = '[User] Select'
}

export class UserLoad implements Action {
  readonly type = ActionTypes.Load;
}

export class UserLoadSuccess implements Action {
  readonly type = ActionTypes.LoadSuccess;
  
  constructor(public payload: User[]) {}
}

export class UserLoadFailure implements Action {
  readonly type = ActionTypes.LoadFailure;
}

export class UserSelect implements Action {
  readonly type = ActionTypes.Select;
  
  constructor(public payload: string) {}
}

export type UserActions = UserLoad | UserLoadSuccess | UserLoadFailure | UserSelect;
