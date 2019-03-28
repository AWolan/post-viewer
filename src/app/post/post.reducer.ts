import { Action, createSelector } from '@ngrx/store';

import { State } from '../app.reducer';
import { ActionTypes, PostActions } from './post.action';
import { Post, UserPosts, PostState } from './post.interface';

export const initialState: PostState = {
  userPosts: {},
  selectedId: null,
  loading: false,
  updating: false,
  showPostEdit: false
};

export function postReducer(state: PostState = initialState, action: PostActions) {
  let userId: string, posts: Post[];
  switch (action.type) {
    case ActionTypes.Load:
      return {
        ...state,
        loading: true
      };
    case ActionTypes.LoadSuccess:
      return {
        ...state,
        userPosts: {
          ...state.userPosts,
          [action.payload.userId]: action.payload.posts
        },
        loading: false
      };
    case ActionTypes.LoadFinish:
      return {
        ...state,
        loading: false
      };
    case ActionTypes.LoadFailure:
      return {
        ...state,
        userPosts: {
          ...state.userPosts,
          [action.payload]: []
        },
        loading: false
      };
    case ActionTypes.Update:
      return {
        ...state,
        updating: true
      };
    case ActionTypes.UpdateSuccess:
      userId = action.payload.userId;
      posts = state.userPosts[userId].map((post: Post) => {
        if(post.id === action.payload.id) {
          return {
            ...post,
            ...action.payload
          };
        }
        return post;
      });
    
      return {
        ...state,
        userPosts: {
          ...state.userPosts,
          [userId]: posts
        },
        updating: false
      };
    case ActionTypes.UpdateFailure:
      userId = action.payload.userId;
      posts = state.userPosts[userId].map((post: Post) => {
        if(post.id === action.payload.id) {
          return {
            ...post,
            ...action.payload,
            title: `${action.payload.title} [Not Saved]`
          };
        }
        return post;
      });
      
      return {
        ...state,
        userPosts: {
          ...state.userPosts,
          [userId]: posts
        },
        updating: false
      };
    case ActionTypes.Select:
      return {
        ...state,
        selectedId: action.payload
      };
    case ActionTypes.ShowEdit:
      return {
        ...state,
        showPostEdit: action.payload
      };
    default:
      return state;
  }
};

export const selectPostState = (state: State) => state.post;
export const selectPosts = createSelector(selectPostState, (state: PostState) => state.userPosts);
export const selectPostSelection = createSelector(selectPostState, (state: PostState) => state.selectedId);
export const selectPostsForUser = createSelector(selectPosts, (userPosts: UserPosts, props: {userId: string}) => props.userId ? userPosts[props.userId] : []);
export const selectUserPostsWithSelection = createSelector([selectPostsForUser, selectPostSelection], (posts: Post[], selectedId: string) => posts.map((post: Post) => ({
  ...post,
  selected: selectedId && selectedId === post.id
})));
export const selectSelectedPost = createSelector(selectUserPostsWithSelection, (posts: Post[]) => posts.filter((post: Post) => post.selected)[0]);
export const selectPostLoading = createSelector(selectPostState, (state: PostState) => state.loading);
export const selectPostUpdating = createSelector(selectPostState, (state: PostState) => state.updating);
export const selectShowPostEdit = createSelector(selectPostState, (state: PostState) => state.showPostEdit);
