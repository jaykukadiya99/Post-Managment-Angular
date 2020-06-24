import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Posts } from '../../models/posts.model';
import { NgForm } from '@angular/forms';

import { PostsService } from '../../service/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  postCreated;

  constructor(public postService: PostsService) { }

  ngOnInit(): void {
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postService.addPost(form.value.title,form.value.content);
  }

  // onAddPost(id1 : HTMLInputElement){
  //   this.newPost=this.enterValue + id1.value; 
  // }

  // @Output() postCreated = new EventEmitter<Posts>();
  // onAddPost(form:NgForm){
  //   if(form.invalid)
  //   {
  //     return;
  //   }
  //   const post : Posts= {
  //     title:form.value.title,
  //     content:form.value.content
  //   };
  //   this.postCreated.emit(post);
  // }

  // onAddPost(){
  //   const post : Posts= {
  //     title:this.enteredTitle,
  //     content:this.enteredContent
  //   };

  //   this.postCreated.emit(post);
  // }
}
