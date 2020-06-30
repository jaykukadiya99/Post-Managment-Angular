import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../../service/posts.service';
import { Posts } from '../../models/posts.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode ='create';
  public isLoading =true;
  private postId:string;
  post:Posts;

  constructor(public postService: PostsService,public route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId = paramMap.get('postId');
        this.postService.getpost(this.postId).subscribe(postData => {
          this.isLoading=false
          this.post = {id:postData.posts._id,title:postData.posts.title,content:postData.posts.content}
        });
      }
      else{
        this.mode='create';
        this.isLoading=false
        this.postId=null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if(this.mode==='create')
    {
      this.postService.addPost(form.value.title,form.value.content);
    }
    else
    {
      this.postService.updatePost(this.postId,form.value.title,form.value.content);
    }
    form.resetForm();
  }

  
}
