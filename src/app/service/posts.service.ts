import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Posts } from '../models/posts.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts : Posts[] = [];
  private postUpdated = new Subject<Posts[]>();

  constructor(private http: HttpClient) { }

  getPosts(){
    this.http.get<{message:string,posts:Posts[]}>("http://localhost:3000/api/posts")
      .subscribe((data)=>{
        this.posts = data.posts;
        this.postUpdated.next([...this.posts]);
      });
  } 

  getPostUpdateListner(){
    return this.postUpdated.asObservable();
  }

  addPost(title:string,content:string){
    const post: Posts = {id:null,title:title,content:content};
    this.posts.push(post);
    this.postUpdated.next([...this.posts])
  }
}
