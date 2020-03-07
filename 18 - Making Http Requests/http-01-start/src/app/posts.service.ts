import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };
    return this.http.post<{ name: string }>(
      'https://ng-complete-guide-7b38d.firebaseio.com/posts.json',
      postData
    );
  }

  // createAndStorePost(title: string, content: string) {
  //   const postData: Post = { title, content };
  //   return this.http
  //     .post<{ name: string }>(
  //       'https://ng-complete-guide-7b38d.firebaseio.com/posts.json',
  //       postData
  //     )
  //     .subscribe(
  //       responseData => {
  //         console.log(responseData);
  //       },
  //       error => {
  //         this.error.next(error.message);
  //       }
  //     );
  // }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-7b38d.firebaseio.com/posts.json'
      )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }

          return postsArray;
        }),
        catchError(errorResponse => {
          // Send to analytics server
          return throwError(errorResponse);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      'https://ng-complete-guide-7b38d.firebaseio.com/posts.json'
    );
  }
}
