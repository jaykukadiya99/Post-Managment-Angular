import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  form : FormGroup;

  constructor(public postService: PostsService,public route:ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      content:new FormControl(null,{validators:[Validators.required]}),
    });

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId = paramMap.get('postId');
        this.postService.getpost(this.postId).subscribe(postData => {
          this.isLoading=false
          this.post = {
            id:postData.posts._id,
            title:postData.posts.title,
            content:postData.posts.content};
          this.form.setValue({
            title:this.post.title,
            content:this.post.content
          });
        });
      }
      else{
        this.mode='create';
        this.isLoading=false
        this.postId=null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if(this.mode==='create')
    {
      this.postService.addPost(this.form.value.title,this.form.value.content);
    }
    else
    {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content);
    }
    this.form.reset();
  }

  
}
