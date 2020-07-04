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
  private postUpdated = new Subject<{post:Posts[],totalPost:number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(pageSize: number, pageIndex: number) {
    const queryParam = `?pageSize=${pageSize}&pageIndex=${pageIndex}`
    this.http
      .get<{ message: string, posts: any, count: number }>("http://localhost:3000/api/posts" + queryParam)
      .pipe(map((data) => {
        return {
          post: data.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          totalPost: data.count
        };
      }))
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.post;
        this.postUpdated.next({post:[...this.posts],totalPost:transformedPostsData.totalPost});
      });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  getpost(id: string) {
    return this.http.get<{ message: string, posts: any }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ message: string, post: Posts }>("http://localhost:3000/api/posts", postData)
      .subscribe((data) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: string | File) {
    let postData: Posts | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }

    this.http
      .put<{ message: string, post: Posts }>("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete<{ message: string }>("http://localhost:3000/api/posts/" + postId);
  }
}
