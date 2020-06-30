import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Posts } from '../models/posts.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Posts[] = [];
  private postUpdated = new Subject<Posts[]>();

  constructor(private http: HttpClient,private router:Router) { }

  getPosts() {
    this.http
      .get<{ message: string, posts: any }>("http://localhost:3000/api/posts")
      .pipe(map((data) => {
        return data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  getpost(id:string){
    return this.http.get<{ message: string, posts: any }>("http://localhost:3000/api/posts/"+ id);
  }

  addPost(title: string, content: string) {
    const post: Posts = { id: null, title: title, content: content };
    this.http
      .post<{ message: string ,postId:string}>("http://localhost:3000/api/posts", post)
      .subscribe((data) => {
        console.log(data.message);
        post.id = data.postId;
        console.log(post.id);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
      this.router.navigate(['/']);
  }

  updatePost(id:string,title:string,content:string){
    const post : Posts = {id:id,title:title,content:content};

    this.http
      .put<{ message: string }>("http://localhost:3000/api/posts/" + id,post)
      .subscribe(response =>{
        const updatedposts = [...this.posts];
        const oldIndex = updatedposts.findIndex(p =>p.id===id);
        updatedposts[oldIndex] = post;
        this.posts = updatedposts;
        this.postUpdated.next([...this.posts]);
      });
      this.router.navigate(['/']);
  }

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/posts/" + postId)
      .subscribe(()=>{
        const updatedposts = this.posts.filter(post=>post.id!==postId);
        this.posts = updatedposts;
        this.postUpdated.next([...this.posts]);
      });
  }
}
