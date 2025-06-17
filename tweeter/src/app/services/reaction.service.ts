import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { TweetReactionRequest } from '../models/reactions/TweetReactionRequest';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  apiURL = 'http://localhost:8080/api/reactions';
  
   constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  //private getHttpOptions() {
    //const token = this.storageService.getSession('token');
    //return {
      //headers: new HttpHeaders({
       // 'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + token
     // })
    //};
 // }
  
  private getHttpOptions() {
  const token = this.storageService.getSessionString("token");
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    })
  };
}



  reactToTweet(tweetId: number, reactionId: number): Observable<any> {
    const body: TweetReactionRequest = {
      tweetId: tweetId,
      reactionId: reactionId
    };
    return this.http.post(`${this.apiURL}/create`, body, this.getHttpOptions());
  }

  getReactionsByTweet(tweetId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiURL}/tweet/${tweetId}`,
    this.getHttpOptions()
  );
}



  //reactToTweet(request: TweetReactionRequest): Observable<any> {
    //return this.http.post(this.apiURL + 'api/reactions/create', request, this.getHttpOptions())
      //.pipe(catchError(this.handleError));
  //}

  private handleError(error: any) {
    console.error(error);
    return throwError(() => new Error('Error: ' + error.message));
  }
  
  getAllReactions(): Observable<any> {
  //return this.http.get<any>(this.apiURL + 'api/reactions/all', this.getHttpOptions());
  return this.http.get(`${this.apiURL}/all`, this.getHttpOptions());

}

getAllTweetReactions(): Observable<any> {
  return this.http.get(`${this.apiURL}/all`, this.getHttpOptions());
}

}
