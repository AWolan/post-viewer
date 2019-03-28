import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { Post } from './post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  constructor() { }
  
  getAllForUser(userId: string): Observable<Post[]> {
    return from(fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then(response => response.json()));
  }
  
  updatePost(post: Post): Observable<Post> {
    return from(fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => response.json()));
  }

}
