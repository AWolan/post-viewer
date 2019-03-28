import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject } from 'rxjs';

import { PostEffects } from './post.effect';
import {
  PostLoad,
  PostLoadSuccess,
  PostLoadFinish,
  PostLoadFailure,
  PostUpdate,
  PostUpdateSuccess,
  PostUpdateFailure,
  PostActions
} from './post.action';
import { Post } from './post.interface';
import { State } from '../app.reducer';
import { PostService } from './post.service';

describe('PostEffects', () => {
  let actions$: ReplaySubject<PostActions>;
  let store: MockStore<State>;
  let effects: PostEffects;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  
  const initialState: State = {
    user: {
      list: [
        {
          id: '1',
          name: 'Test',
          username: 'tester'
        }
      ],
      selectedId: '1',
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
    const spy = jasmine.createSpyObj('PostService', ['getAllForUser', 'updatePost']);
    
    TestBed.configureTestingModule({
      providers: [
        PostEffects,
        provideMockStore({initialState}),
        provideMockActions(() => actions$),
        { provide: PostService, useValue: spy }
      ]
    });
    
    store = TestBed.get(Store);
    postServiceSpy = TestBed.get(PostService);
  });

  it('should be created', () => {
    effects = TestBed.get(PostEffects);
    expect(effects).toBeTruthy();
  });
    
  describe('posts load', () => {
    it('should successful load', () => {
      const userId = '1';
      const action = new PostLoad(userId);
      actions$ = new ReplaySubject();
      actions$.next(action);
  
      effects = TestBed.get(PostEffects);
      
      const posts = [
        {
          id: '1',
          userId: '1',
          title: 'Some Title 1',
          body: 'Body of post 1 for user 1'
        },
        {
          id: '2',
          userId: '1',
          title: 'Some Title 2',
          body: 'Body of post 2 for user 1'
        }
      ];
      const resultAction = new PostLoadSuccess({
        userId: '1',
        posts
      });
      
      const serviceResponse = new ReplaySubject();
      postServiceSpy.getAllForUser.and.returnValue(serviceResponse);
      serviceResponse.next(posts);
      
      effects.loadPosts$.subscribe(result => {
        expect(result).toEqual(resultAction);
      });
    });

    it('should skip load when already loaded', () => {
      const userId = '1';
      const action = new PostLoad(userId);
      actions$ = new ReplaySubject();
      actions$.next(action);
    
      const posts = [
        {
          id: '1',
          userId: '1',
          title: 'Some Title 1',
          body: 'Body of post 1 for user 1'
        },
        {
          id: '2',
          userId: '1',
          title: 'Some Title 2',
          body: 'Body of post 2 for user 1'
        }
      ];
      store.setState({
        ...initialState,
        post: {
          ...initialState.post,
          userPosts: {
            '1': posts
          }
        }
      });
      effects = TestBed.get(PostEffects);
      
      const resultAction = new PostLoadFinish();
    
      expect(postServiceSpy.getAllForUser).not.toHaveBeenCalled();
      effects.loadPosts$.subscribe(result => {
        expect(result).toEqual(resultAction);
      });
    });

    it('should failure load', () => {
      const userId = '1';
      const action = new PostLoad(userId);
      actions$ = new ReplaySubject();
      actions$.next(action);

      effects = TestBed.get(PostEffects);
    
      const resultAction = new PostLoadFailure(userId);
    
      const serviceResponse = new ReplaySubject();
      postServiceSpy.getAllForUser.and.returnValue(serviceResponse);
      serviceResponse.error('404');
    
      effects.loadPosts$.subscribe(result => {
        expect(result).toEqual(resultAction);
      });
    });
  });
    
  describe('post update', () => {
    it('should successful update', () => {
      const post: Post = {
        id: '1',
        userId: '1',
        title: 'Some Title 1',
        body: 'Body of post 1 for user 1'
      };
      const action = new PostUpdate(post);
      actions$ = new ReplaySubject();
      actions$.next(action);
  
      effects = TestBed.get(PostEffects);
      
      const resultAction = new PostUpdateSuccess(post);
      
      const serviceResponse = new ReplaySubject();
      postServiceSpy.updatePost.and.returnValue(serviceResponse);
      serviceResponse.next(post);
      
      effects.updatePost$.subscribe(result => {
        expect(result).toEqual(resultAction);
      });
    });

    it('should failure update', () => {
      const post: Post = {
        id: '1',
        userId: '1',
        title: 'Some Title 1',
        body: 'Body of post 1 for user 1'
      };
      const action = new PostUpdate(post);
      actions$ = new ReplaySubject();
      actions$.next(action);
  
      effects = TestBed.get(PostEffects);
      
      const resultAction = new PostUpdateFailure(post);
      
      const serviceResponse = new ReplaySubject();
      postServiceSpy.updatePost.and.returnValue(serviceResponse);
      serviceResponse.error('404');
      
      effects.updatePost$.subscribe(result => {
        expect(result).toEqual(resultAction);
      });
    });
  });

  
});
