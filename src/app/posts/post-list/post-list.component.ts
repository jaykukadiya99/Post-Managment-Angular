import { Component, OnInit, Input } from '@angular/core';

import { Posts } from '../../models/posts.model'; 
import { PostsService } from '../../service/posts.service'; 
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor(public postsService : PostsService) { }

  ngOnInit(): void {
    this.posts=this.postsService.getPosts();
  }
  // posts=[
  //   {title:"1", content:"content 1"},
  //   {title:"2", content:"content 2"},
  //   {title:"3", content:"content 3"},
  // ];

  // @Input() posts : Posts[]=[];
  posts : Posts[]=[];
}
