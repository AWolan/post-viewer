import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from './app.reducer';
import { User } from './user/user.interface';
import {
  selectUsersWithSelection,
  selectUserLoading
} from './user/user.reducer';
import {
  UserLoad,
  UserSelect
} from './user/user.action';
import { Post } from './post/post.interface';
import {
  selectUserPostsWithSelection,
  selectSelectedPost,
  selectPostLoading,
  selectPostUpdating,
  selectShowPostEdit
} from './post/post.reducer';
import {
  PostLoad,
  PostSelect,
  PostUpdate,
  PostShowEdit
} from './post/post.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users$: Observable<User[]>;
  posts$: Observable<Post[]>;
  usersLoading$: Observable<boolean>;
  postsLoading$: Observable<boolean>;
  postUpdating$: Observable<boolean>;
  selectedPost$: Observable<Post>;
  showPostEdit$: Observable<boolean>;
  
  constructor(private store: Store<State>) {
    this.users$ = store.pipe(select(selectUsersWithSelection));
    this.usersLoading$ = store.pipe(select(selectUserLoading));
    this.postsLoading$ = store.pipe(select(selectPostLoading));
    this.postUpdating$ = store.pipe(select(selectPostUpdating));
    this.selectedPost$ = store.pipe(select(selectSelectedPost));
    this.showPostEdit$ = store.pipe(select(selectShowPostEdit));
  }
  
  ngOnInit() {
    this.store.dispatch(new UserLoad());
  }
  
  userClickHandler(userId: string) {
    this.store.dispatch(new PostShowEdit(false));
    this.store.dispatch(new PostLoad(userId));
    this.store.dispatch(new UserSelect(userId));
    this.store.dispatch(new PostSelect(null));
    this.posts$ = this.store.pipe(select(selectUserPostsWithSelection, {userId}));
  }
  
  postClickHandler(post: Post) {
    this.store.dispatch(new PostSelect(post.id));
    this.store.dispatch(new PostShowEdit(true));
  }
  
  postChangeHandler(post: Post) {
    this.store.dispatch(new PostShowEdit(false));
    this.store.dispatch(new PostUpdate(post));
  }
  
  postEditCloseHandler() {
    this.store.dispatch(new PostShowEdit(false));
  }
}
