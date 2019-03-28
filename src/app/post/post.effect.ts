import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { State } from '../app.reducer';
import {
  ActionTypes,
  PostLoad,
  PostLoadSuccess,
  PostLoadFinish,
  PostLoadFailure,
  PostUpdate,
  PostUpdateSuccess,
  PostUpdateFailure,
  PostActions
} from './post.action';
import { selectPosts } from './post.reducer';
import { UserPosts } from './post.interface';
import { PostService } from './post.service';

@Injectable()
export class PostEffects {
 
  @Effect()
  loadPosts$ = this.actions$
    .pipe(
      ofType(ActionTypes.Load),
      withLatestFrom(this.store$.pipe(select(selectPosts))),
      mergeMap(([action, posts]: [PostLoad, UserPosts]): Observable<PostLoadSuccess | PostLoadFailure | PostLoadFinish> => {
        if (action.payload && posts[action.payload] && posts[action.payload].length > 0) {
          return of(new PostLoadFinish());
        }
        return this.postService.getAllForUser(action.payload)
          .pipe(
            map(posts => (new PostLoadSuccess({
              userId: action.payload,
              posts
            }))),
            catchError(() => of(new PostLoadFailure(action.payload)))
          )
      })
    );
    
  @Effect()
  updatePost$ = this.actions$
    .pipe(
      ofType(ActionTypes.Update),
      mergeMap((action: PostUpdate): Observable<PostUpdateSuccess | PostUpdateFailure> => this.postService.updatePost(action.payload)
          .pipe(
            map(post => (new PostUpdateSuccess(post))),
            catchError(() => of(new PostUpdateFailure(action.payload)))
          ))
    );
 
  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private postService: PostService
  ) {}
}