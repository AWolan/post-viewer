import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, from } from 'rxjs';

import {
  PostLoad,
  PostLoadSuccess,
  PostLoadFinish,
  PostLoadFailure,
  PostUpdate,
  PostUpdateSuccess,
  PostUpdateFailure,
  PostSelect,
  PostShowEdit,
  PostActions
} from './post.action';
import {
  Post,
  UserPosts,
  PostState
} from './post.interface';
import {
  postReducer,
  selectPostState,
  selectPosts,
  selectPostSelection,
  selectPostsForUser,
  selectUserPostsWithSelection,
  selectSelectedPost,
  selectPostLoading,
  selectPostUpdating,
  selectShowPostEdit
} from './post.reducer';
import { State } from '../app.reducer';

describe('PostReducer', () => {
  const initialState: PostState = {
    userPosts: {},
    selectedId: null,
    loading: false,
    updating: false,
    showPostEdit: false
  };
    
  it('should get initial state', () => {
    const state = postReducer(undefined, {
      type: null
    });
      
    expect(state).toEqual(initialState);
  });
    
  describe('actions', () => {
    it('should perform load', () => {
      const action = new PostLoad('1');
      const resultState: PostState = {
        ...initialState,
        loading: true
      };
        
      const state = postReducer(initialState, action);
      
      expect(state).toEqual(resultState);
    });
    
    it('should perform load success', () => {
      const userId = '1';
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
      const action = new PostLoadSuccess({
        userId,
        posts
      });
      const initState: PostState = {
        ...initialState,
        loading: true
      };
      const resultState: PostState = {
        ...initialState,
        userPosts: {
          [userId]: posts
        },
        loading: false
      };
      
      const state = postReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
    
    it('should perform load finish', () => {
      const action = new PostLoadFinish();
      const initState: PostState = {
        ...initialState,
        loading: true
      };
      const resultState: PostState = {
        ...initialState,
        loading: false
      };
      
      const state = postReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
    
    it('should perform load failure', () => {
      const userId = '1';
      const action = new PostLoadFailure(userId);
      const initState: PostState = {
        ...initialState,
        loading: true
      };
      const resultState: PostState = {
        ...initialState,
        userPosts: {
          [userId]: []
        },
        loading: false
      };
      
      const state = postReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
      
    it('should perform update', () => {
      const post: Post = {
        id: '1',
        userId: '1',
        title: 'Some Title 1',
        body: 'Body of post 1 for user 1'
      };
      const action = new PostUpdate(post);
      const resultState: PostState = {
        ...initialState,
        updating: true
      };
        
      const state = postReducer(initialState, action);
      
      expect(state).toEqual(resultState);
    });
    
    it('should perform update success', () => {
      const userId = '1';
      const post: Post = {
        id: '1',
        userId,
        title: 'Some Title 1',
        body: 'Body of post 1 for user 1'
      };
      const action = new PostUpdateSuccess(post);
      const initState: PostState = {
        ...initialState,
        userPosts: {
          [userId]: [
            {
              id: '1',
              userId: '1',
              title: 'Prev Title 1',
              body: 'Prev body of post 1 for user 1'
            }
          ]
        },
        updating: true
      };
      const resultState: PostState = {
        ...initialState,
        userPosts: {
          [userId]: [post]
        },
        updating: false
      };
      
      const state = postReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
    
    it('should perform update failure', () => {
      const userId = '1';
      const post: Post = {
        id: '1',
        userId,
        title: 'Some Title 1',
        body: 'Body of post 1 for user 1'
      };
      const action = new PostUpdateFailure(post);
      const initState: PostState = {
        ...initialState,
        userPosts: {
          [userId]: [
            {
              id: '1',
              userId: '1',
              title: 'Prev Title 1',
              body: 'Prev body of post 1 for user 1'
            }
          ]
        },
        updating: true
      };
      const resultState: PostState = {
        ...initialState,
        userPosts: {
          [userId]: [
            {
              ...post,
              title: `${post.title} [Not Saved]`
            }
          ]
        },
        updating: false
      };
      
      const state = postReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
      
    it('should perform select', () => {
      const postId = '1';
      const action = new PostSelect(postId);
      const resultState: PostState = {
        ...initialState,
        selectedId: postId
      };
        
      const state = postReducer(initialState, action);
      
      expect(state).toEqual(resultState);
    });
      
    it('should perform show edit', () => {
      const showEdit = true;
      const action = new PostShowEdit(showEdit);
      const initState: PostState = {
        ...initialState,
        showPostEdit: !showEdit
      };
      const resultState: PostState = {
        ...initialState,
        showPostEdit: showEdit
      };
        
      const state = postReducer(initState, action);
      
      expect(state).toEqual(resultState);
    });
  });
    
  describe('selectors', () => {
    it('should select post state', () => {
      const postState: PostState = {
        userPosts: {},
        selectedId: null,
        loading: false,
        updating: false,
        showPostEdit: false
      };
      const state: State = {
        user: null,
        post: postState
      };
    
      expect(selectPostState(state)).toEqual(postState);
    });
    
    it('should select posts', () => {
      const userPosts: UserPosts = {
        '1': [
          {
            id: '1',
            userId: '1',
            title: 'Title',
            body: 'Body'
          }
        ],
        '2': []
      };
      const postState: PostState = {
        userPosts,
        selectedId: null,
        loading: false,
        updating: false,
        showPostEdit: false
      };
    
      expect(selectPosts.projector(postState)).toEqual(userPosts);
    });
    
    it('should select post selection', () => {
      const selectedId = '1';
      const userPosts: UserPosts = {
        '1': [
          {
            id: '1',
            userId: '1',
            title: 'Title',
            body: 'Body'
          }
        ],
        '2': []
      };
      const postState: PostState = {
        userPosts,
        selectedId,
        loading: false,
        updating: false,
        showPostEdit: false
      };
    
      expect(selectPostSelection.projector(postState)).toEqual(selectedId);
    });
    
    it('should select posts for user', () => {
      const userId = '1';
      const posts: Post[] = [
        {
          id: '1',
          userId,
          title: 'Title',
          body: 'Body'
        }
      ];
      const userPosts: UserPosts = {
        [userId]: posts,
        '2': []
      };
      const props = {
        userId
      };
      
      expect(selectPostsForUser.projector(userPosts, props)).toEqual(posts);
    });
    
    it('should select posts for user with selection', () => {
      const userId = '1';
      const selectedId = '1';
      const post1: Post = {
        id: '1',
        userId,
        title: 'Title 1',
        body: 'Body 1'
      };
      const post2: Post = {
        id: '2',
        userId,
        title: 'Title 2',
        body: 'Body 2'
      };
      const posts: Post[] = [post1, post2];
      const resultPosts: Post[] = [
        {
          ...post1,
          selected: true
        },
        {
          ...post2,
          selected: false
        }
      ];
      
      expect(selectUserPostsWithSelection.projector(posts, selectedId)).toEqual(resultPosts);
    });
    
    it('should select selected post', () => {
      const userId = '1';
      const selectedId = '1';
      const post1: Post = {
        id: '1',
        userId,
        title: 'Title 1',
        body: 'Body 1',
        selected: true
      };
      const post2: Post = {
        id: '2',
        userId,
        title: 'Title 2',
        body: 'Body 2',
        selected: false
      };
      const posts: Post[] = [post1, post2];
      
      expect(selectSelectedPost.projector(posts)).toEqual(post1);
    });
    
    it('should select loading flag', () => {
      const loading = true;
      const postState: PostState = {
        userPosts: {},
        selectedId: null,
        loading,
        updating: false,
        showPostEdit: false
      };
      
      expect(selectPostLoading.projector(postState)).toEqual(loading);
    });
    
    it('should select updating flag', () => {
      const updating = true;
      const postState: PostState = {
        userPosts: {},
        selectedId: null,
        loading: false,
        updating,
        showPostEdit: false
      };
      
      expect(selectPostUpdating.projector(postState)).toEqual(updating);
    });
    
    it('should select loading flag', () => {
      const showPostEdit = true;
      const postState: PostState = {
        userPosts: {},
        selectedId: null,
        loading: false,
        updating: false,
        showPostEdit
      };
      
      expect(selectShowPostEdit.projector(postState)).toEqual(showPostEdit);
    });
  });
});
