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
  private postsSub: Subscription;

  constructor(public postsService : PostsService) { }

  ngOnInit(): void {
    // this.posts=this.postsService.getPosts();
    this.postsService.getPosts();
    this.postsService.getPostUpdateListner()
      .subscribe((posts : Posts[])=>{
        this.posts = posts
      });
  }
  // posts=[
  //   {title:"1", content:"content 1"},
  //   {title:"2", content:"content 2"},
  //   {title:"3", content:"content 3"},
  // ];

  // @Input() posts : Posts[]=[];
  

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}
