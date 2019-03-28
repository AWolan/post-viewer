import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, from } from 'rxjs';

import {
  UserLoad,
  UserLoadSuccess,
  UserLoadFailure,
  UserSelect,
  UserActions
} from './user.action';
import {
  User,
  UserState
} from './user.interface';
import {
  userReducer,
  selectUserState,
  selectUsers,
  selectUserSelection,
  selectUsersWithSelection,
  selectUserLoading
} from './user.reducer';
import { State } from '../app.reducer';

describe('UserReducer', () => {
  const initialState: UserState = {
    list: [],
    selectedId: null,
    loading: false
  };
    
  it('should get initial state', () => {
    const state = userReducer(undefined, {
      type: null
    });
      
    expect(state).toEqual(initialState);
  });
    
  describe('actions', () => {
    it('should perform load', () => {
      const action = new UserLoad();
      const resultState: UserState = {
        ...initialState,
        loading: true
      };
        
      const state = userReducer(initialState, action);
      
      expect(state).toEqual(resultState);
    });
    
    it('should perform load success', () => {
      const users = [
        {
          id: '1',
          name: 'Test 1',
          username: 'tester1'
        },
        {
          id: '2',
          name: 'Test O 2',
          username: 'tester2'
        }
      ];
      const action = new UserLoadSuccess(users);
      const initState: UserState = {
        ...initialState,
        loading: true
      };
      const resultState: UserState = {
        ...initialState,
        list: users,
        loading: false
      };
      
      const state = userReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
    
    it('should perform load failure', () => {
      const action = new UserLoadFailure();
      const initState: UserState = {
        ...initialState,
        loading: true
      };
      const resultState: UserState = {
        ...initialState,
        list: [],
        loading: false
      };
      
      const state = userReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
      
    it('should perform select', () => {
      const userId = '1';
      const action = new UserSelect(userId);
      const resultState: UserState = {
        ...initialState,
        selectedId: userId
      };
        
      const state = userReducer(initialState, action);
      
      expect(state).toEqual(resultState);
    });
  });
    
  describe('selectors', () => {
    it('should select user state', () => {
      const userState: UserState = {
        list: [],
        selectedId: null,
        loading: false
      };
      const state: State = {
        user: userState,
        post: null
      };
    
      expect(selectUserState(state)).toEqual(userState);
    });
    
    it('should select users', () => {
      const users = [
        {
          id: '1',
          name: 'Test 1',
          username: 'tester1'
        },
        {
          id: '2',
          name: 'Test O 2',
          username: 'tester2'
        }
      ];
      const userState: UserState = {
        list: users,
        selectedId: null,
        loading: false
      };
    
      expect(selectUsers.projector(userState)).toEqual(users);
    });
    
    it('should select user selection', () => {
      const selectedId = '1';
      const users = [
        {
          id: '1',
          name: 'Test 1',
          username: 'tester1'
        },
        {
          id: '2',
          name: 'Test O 2',
          username: 'tester2'
        }
      ];
      const userState: UserState = {
        list: users,
        selectedId,
        loading: false
      };
    
      expect(selectUserSelection.projector(userState)).toEqual(selectedId);
    });
    
    it('should select users with selection', () => {
      const selectedId = '1';
      const user1: User = {
        id: '1',
        name: 'Test 1',
        username: 'tester1'
      };
      const user2: User = {
        id: '2',
        name: 'Test O 2',
        username: 'tester2'
      }
      const users: User[] = [user1, user2];
      const resultUsers: User[] = [
        {
          ...user1,
          selected: true
        },
        {
          ...user2,
          selected: false
        }
      ];
      
      expect(selectUsersWithSelection.projector(users, selectedId)).toEqual(resultUsers);
    });
    
    it('should select loading flag', () => {
      const loading = true;
      const userState: UserState = {
        list: [],
        selectedId: null,
        loading
      };
      
      expect(selectUserLoading.projector(userState)).toEqual(loading);
    });
  });
});
