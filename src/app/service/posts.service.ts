import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { Posts } from '../models/posts.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment'
import { map } from 'rxjs/operators';

const BASE_URL = environment.apiUrl + "posts/"

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
      .get<{ message: string, posts: any, count: number }>(BASE_URL + queryParam)
      .pipe(map((data) => {
        return {
          post: data.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator:post.creator
            };
          }),
          totalPost: data.count
        };
      }))
      .subscribe(transformedPostsData => {
        console.log(transformedPostsData);
        this.posts = transformedPostsData.post;
        this.postUpdated.next({post:[...this.posts],totalPost:transformedPostsData.totalPost});
      });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  getpost(id: string) {
    return this.http.get<{ message: string, posts: any }>(BASE_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ message: string, post: Posts }>(BASE_URL, postData)
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
      postData = { id: id, title: title, content: content, imagePath: image ,creator:null};
    }

    this.http
      .put<{ message: string, post: Posts }>(BASE_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete<{ message: string }>(BASE_URL + postId);
  }
}
