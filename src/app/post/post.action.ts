import { Action } from '@ngrx/store';

import { Post } from './post.interface';

export enum ActionTypes {
  Load = '[Post] Load',
  LoadSuccess = '[Post] Load Success',
  LoadFinish = '[Post] Load Finish',
  LoadFailure = '[Post] Load Failure',
  Update = '[Post] Update',
  UpdateSuccess = '[Post] Update Success',
  UpdateFailure = '[Post] Update Failure',
  Select = '[Post] Select',
  ShowEdit = '[Post] Show Edit'
}

export class PostLoad implements Action {
  readonly type = ActionTypes.Load;
  
  constructor(public payload: string) {}
}

export class PostLoadSuccess implements Action {
  readonly type = ActionTypes.LoadSuccess;
  
  constructor(public payload: {
    userId: string;
    posts: Post[];
  }) {}
}

export class PostLoadFinish implements Action {
  readonly type = ActionTypes.LoadFinish;
}

export class PostLoadFailure implements Action {
  readonly type = ActionTypes.LoadFailure;
  
  constructor(public payload: string) {}
}

export class PostUpdate implements Action {
  readonly type = ActionTypes.Update;
  
  constructor(public payload: Post) {}
}

export class PostUpdateSuccess implements Action {
  readonly type = ActionTypes.UpdateSuccess;
  
  constructor(public payload: Post) {}
}

export class PostUpdateFailure implements Action {
  readonly type = ActionTypes.UpdateFailure;
  
  constructor(public payload: Post) {}
}

export class PostSelect implements Action {
  readonly type = ActionTypes.Select;
  
  constructor(public payload: string) {}
}

export class PostShowEdit implements Action {
  readonly type = ActionTypes.ShowEdit;
  
  constructor(public payload: boolean) {}
}

export type PostActions = PostLoad | PostLoadSuccess | PostLoadFinish | PostLoadFailure | PostUpdate | PostUpdateSuccess | PostUpdateFailure | PostSelect | PostShowEdit;
