import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject } from 'rxjs';

import { UserEffects } from './user.effect';
import {
  UserLoad,
  UserLoadSuccess,
  UserLoadFailure,
  UserActions
} from './user.action';
import { User } from './user.interface';
import { State } from '../app.reducer';
import { UserService } from './user.service';

describe('UserEffects', () => {
  let actions$: ReplaySubject<UserActions>;
  let store: MockStore<State>;
  let effects: UserEffects;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  
  const initialState: State = {
    user: {
      list: [],
      selectedId: null,
      loading: false
    },
    post: {
      userPosts: {},
      selectedId: null,
      loading: false,
      updating: false,
      showPostEdit: false
    }
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getAll']);
    
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockStore({initialState}),
        provideMockActions(() => actions$),
        { provide: UserService, useValue: spy }
      ]
    });
    
    store = TestBed.get(Store);
    userServiceSpy = TestBed.get(UserService);
  });

  it('should be created', () => {
    effects = TestBed.get(UserEffects);
    expect(effects).toBeTruthy();
  });
    
  describe('users load', () => {
    it('should successful load', () => {
      const action = new UserLoad();
      actions$ = new ReplaySubject();
      actions$.next(action);
  
      effects = TestBed.get(UserEffects);
      
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
      const resultAction = new UserLoadSuccess(users);
      
      const serviceResponse = new ReplaySubject();
      userServiceSpy.getAll.and.returnValue(serviceResponse);
      serviceResponse.next(users);
      
      effects.loadUsers$.subscribe(result => {
        expect(result).toEqual(resultAction);
      });
    });
    
    it('should failure load', () => {
      const action = new UserLoad();
      actions$ = new ReplaySubject();
      actions$.next(action);

      effects = TestBed.get(UserEffects);
    
      const resultAction = new UserLoadFailure();
    
      const serviceResponse = new ReplaySubject();
      userServiceSpy.getAll.and.returnValue(serviceResponse);
      serviceResponse.error('404');
    
      effects.loadUsers$.subscribe(result => {
        expect(result).toEqual(resultAction);
      });
    });
  });
  
});
