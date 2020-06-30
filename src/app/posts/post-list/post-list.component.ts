import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs'
import { Posts } from '../../models/posts.model'; 
import { PostsService } from '../../service/posts.service'; 
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts : Posts[]=[];
  public postsSub: Subscription;
  isLoading=true;

  constructor(public postsService : PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListner()
      .subscribe((posts : Posts[])=>{
        this.isLoading=false
        this.posts = posts
      });
  }
  
  onDelete(postId:string){
    this.postsService.deletePost(postId);
  }
  ngOnDestroy(){
   this.postsSub.unsubscribe();
  }
}
