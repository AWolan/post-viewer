import { Action, createSelector } from '@ngrx/store';

import { State } from '../app.reducer';
import { ActionTypes, UserActions } from './user.action';
import { User, UserState } from './user.interface';

export const initialState: UserState = {
  list: [],
  selectedId: null,
  loading: false
};

export function userReducer(state: UserState = initialState, action: UserActions) {
  switch (action.type) {
    case ActionTypes.Load:
      return {
        ...state,
        loading: true
      };
    case ActionTypes.LoadSuccess:
      return {
        ...state,
        list: action.payload,
        loading: false
      };
    case ActionTypes.LoadFailure:
      return {
        ...state,
        list: [],
        loading: false
      };
    case ActionTypes.Select:
      return {
        ...state,
        selectedId: action.payload
      };
    default:
      return state;
  }
};

export const selectUserState = (state: State) => state.user;
export const selectUsers = createSelector(selectUserState, (state: UserState) => state.list);
export const selectUserSelection = createSelector(selectUserState, (state: UserState) => state.selectedId);
export const selectUsersWithSelection = createSelector([selectUsers, selectUserSelection], (users: User[], selectedId: string) => users.map((user: User) => ({
  ...user,
  selected: selectedId && selectedId === user.id
})));
export const selectUserLoading = createSelector(selectUserState, (state: UserState) => state.loading);
