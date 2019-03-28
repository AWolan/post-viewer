import {
  Component,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Post } from './post.interface';

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnChanges {
  @Input() post: Post;
  @Output() postChange = new EventEmitter<Post>();
  @Output() close = new EventEmitter<any>();
  editedPost: Post;
  
  ngOnChanges(changes: SimpleChanges) {
    this.editedPost = {
      ...changes.post.currentValue
    };
  }
  
  saveClickHandler(post) {
    this.postChange.emit(post);
  }
  
  closeClickHandler() {
    this.close.emit();
  }
}