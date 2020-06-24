import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Posts} from '../models/posts.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts : Posts[] = [];
  private postUpdated = new Subject<Posts[]>();

  constructor() { }

  getPosts(){
    return [...this.posts];
  } 

  getPostUpdateListner(){
    return this.postUpdated.asObservable();
  }

  addPost(title:string,content:string){
    const post: Posts = {title:title,content:content};
    this.posts.push(post);
    this.postUpdated.next([...this.posts])
  }
}
