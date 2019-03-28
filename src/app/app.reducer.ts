import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../environments/environment';
import { postReducer } from './post/post.reducer';
import { PostState } from './post/post.interface';
import { userReducer } from './user/user.reducer';
import { UserState } from './user/user.interface';

export interface State {
  post: PostState;
  user: UserState;
}

export const reducers: ActionReducerMap<State> = {
  post: postReducer,
  user: userReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
