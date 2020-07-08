import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'
import { Posts } from '../../models/posts.model';
import { PostsService } from '../../service/posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy,OnDestroy {

  posts: Posts[] = [];
  public postsSub: Subscription;
  isLoading = true;
  pageSize = 2;
  pageLength = 0;
  pageIndex = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId:string;
  userIsAuthenticated = false;
  private authListnerSubs: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.pageSize, this.pageIndex);
    this.postsSub = this.postsService.getPostUpdateListner()
      .subscribe((postsData: { post: Posts[], totalPost: number }) => {
        this.isLoading = false
        this.posts = postsData.post;
        this.pageLength = postsData.totalPost;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.pageIndex)
    });
  }

  pageChange(pageDate: PageEvent) {
    this.isLoading = true;
    this.pageIndex = pageDate.pageIndex + 1;
    this.pageSize = pageDate.pageSize;
    this.postsService.getPosts(this.pageSize, this.pageIndex);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListnerSubs.unsubscribe();
  }
}
