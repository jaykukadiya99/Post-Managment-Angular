import { Injectable } from '@angular/core';
import {Posts} from '../models/posts.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts : Posts[] = [];
  constructor() { }

  getPosts(){
    return [...this.posts];
  }

  addPost(title:string,content:string){
    const post: Posts = {title:title,content:content};
    this.posts.push(post);
  }
}
