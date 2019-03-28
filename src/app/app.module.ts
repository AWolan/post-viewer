import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user/user.effect';
import { PostEffects } from './post/post.effect';
import { UserComponent } from './user/user.component';
import { PostComponent } from './post/post.component';
import { PostEditComponent } from './post/post-edit.component';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    PostComponent,
    PostEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([UserEffects, PostEffects])
  ],
  providers: [
    UserService,
    PostService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
