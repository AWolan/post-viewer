import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, select } from '@ngrx/store';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { PostComponent } from './post/post.component';
import { PostEditComponent } from './post/post-edit.component';

import { State } from './app.reducer';
import {
  UserLoad,
  UserSelect
} from './user/user.action';
import {
  PostLoad,
  PostShowEdit,
  PostSelect,
  PostUpdate
} from './post/post.action';
import { User } from './user/user.interface';
import { Post } from './post/post.interface';
import { selectUserPostsWithSelection } from './post/post.reducer';

describe('AppComponent', () => {
  let store: MockStore<State>;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: any;
  
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
   
  // helper functions
  const clearSpyCalls = (spy) => {
    if (spy.calls) {  
      spy.calls.reset()
    }
  };
  const clearStoreDispatchCalls = () => {
    clearSpyCalls(store.dispatch);
  };
  const clickFirstUserComponent = () => {
    const userComponent = compiled.querySelector('user');
    userComponent.click();
  };
  const clickFirstPostComponent = () => {
    const postComponent = compiled.querySelector('post');
    postComponent.click();
  };
  const setStateAndDetectChanges = (state) => {
    store.setState(state);
    fixture.detectChanges();
  };
    
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        UserComponent,
        PostComponent,
        PostEditComponent
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();
    
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'pipe').and.callThrough();
      
    fixture = TestBed.createComponent(AppComponent);
    compiled = fixture.debugElement.nativeElement;
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call users load on init', () => {
    fixture.detectChanges();
      
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new UserLoad());
  });

  it('should call posts load on user click', () => {
    const userId = '1';
    const user: User = {
      id: userId,
      name: 'Test O',
      username: 'tester'
    };
    const state: State = {
      ...initialState,
      user: {
        ...initialState.user,
        list: [user]
      }
    };
      
    setStateAndDetectChanges(state);
      
    clearStoreDispatchCalls();
    
    clickFirstUserComponent();
      
    expect(store.dispatch).toHaveBeenCalledTimes(4);
    expect(store.dispatch).toHaveBeenCalledWith(new UserSelect(userId));
    expect(store.dispatch).toHaveBeenCalledWith(new PostLoad(userId));
    expect(store.dispatch).toHaveBeenCalledWith(new PostShowEdit(false));
    expect(store.dispatch).toHaveBeenCalledWith(new PostSelect(null));
  });

  it('should call select post and open editor on post click', () => {
    const userId = '1';
    const user: User = {
      id: userId,
      name: 'Test O',
      username: 'tester'
    };
    const post: Post = {
      id: '1',
      userId: userId,
      title: 'Title 1',
      body: 'Body 1'
    };
    const state: State = {
      ...initialState,
      user: {
        ...initialState.user,
        list: [user]
      }
    };
    const state2: State = {
      ...state,
      user: {
        ...state.user,
        selectedId: userId
      },
      post: {
        ...state.post,
        userPosts: {
          [userId]: [post]
        }
      }
    };
    
    setStateAndDetectChanges(state);
    
    clickFirstUserComponent();
      
    setStateAndDetectChanges(state2);
      
    clearStoreDispatchCalls();
      
    clickFirstPostComponent();
      
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(new PostSelect('1'));
    expect(store.dispatch).toHaveBeenCalledWith(new PostShowEdit(true));
  });

  it('should call post update and close editor on save button click', () => {
    const userId = '1';
    const user: User = {
      id: userId,
      name: 'Test O',
      username: 'tester'
    };
    const post: Post = {
      id: '1',
      userId: userId,
      title: 'Title 1',
      body: 'Body 1'
    };
    const state: State = {
      ...initialState,
      user: {
        ...initialState.user,
        list: [user]
      }
    };
    const state2: State = {
      ...state,
      user: {
        ...state.user,
        selectedId: userId
      },
      post: {
        ...state.post,
        userPosts: {
          [userId]: [post]
        }
      }
    };
    const state3: State = {
      ...state2,
      post: {
        ...state2.post,
        selectedId: post.id,
        showPostEdit: true
      }
    };
    
    setStateAndDetectChanges(state);
    
    clickFirstUserComponent();
      
    setStateAndDetectChanges(state2);
      
    clickFirstPostComponent();
      
    setStateAndDetectChanges(state3);
      
    clearStoreDispatchCalls();
      
    const saveButton = compiled.querySelector('button[class="save"]');
    saveButton.click();
      
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(new PostUpdate({
      ...post,
      selected: true
    }));
    expect(store.dispatch).toHaveBeenCalledWith(new PostShowEdit(false));
  });

  it('should close editor on close button click', () => {
    const userId = '1';
    const user: User = {
      id: userId,
      name: 'Test O',
      username: 'tester'
    };
    const post: Post = {
      id: '1',
      userId: userId,
      title: 'Title 1',
      body: 'Body 1'
    };
    const state: State = {
      ...initialState,
      user: {
        ...initialState.user,
        list: [user]
      }
    };
    const state2: State = {
      ...state,
      user: {
        ...state.user,
        selectedId: userId
      },
      post: {
        ...state.post,
        userPosts: {
          [userId]: [post]
        }
      }
    };
    const state3: State = {
      ...state2,
      post: {
        ...state2.post,
        selectedId: post.id,
        showPostEdit: true
      }
    };
    
    setStateAndDetectChanges(state);
    
    clickFirstUserComponent();
      
    setStateAndDetectChanges(state2);
      
    clickFirstPostComponent();
      
    setStateAndDetectChanges(state3);
      
    clearStoreDispatchCalls();
      
    const saveButton = compiled.querySelector('button[class="close"]');
    saveButton.click();
      
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new PostShowEdit(false));
  });
});
