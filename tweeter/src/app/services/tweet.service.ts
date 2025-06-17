import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from "../services/storage.service"; 

@Injectable({
 providedIn: 'root'
})
export class TweetService {

 apiURL = 'https://back-autos-tweet.onrender.com/';
 token='';

 constructor(
  private http: HttpClient,
  private storageService: StorageService
) {}

getHttpOptions() {
    const token = this.storageService.getSession('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
  }
 //httpOptions = {
   //headers: new HttpHeaders({
     //'Content-Type': 'application/json',
     //'Access-Control-Allow-Origin':'*',
     //'Authorization':'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZHNvZnQiLCJpYXQiOjE3NDg0Njk5MjMsImV4cCI6MTc0ODU1NjMyM30.1Hk6h_54nSHTBtNntLxeu7jR2OMGypgvvp39CQxQhW4'
   //})
 //}
//errorMessage = "";


 getTweets(): Observable<any> {
  const url = this.apiURL + 'api/tweets/all';
  console.log("GET tweets desde:", url);

  return this.http.get<any>(url, this.getHttpOptions())
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
}

 postTweet(myTweet: string) {
    const body = {
      tweet: myTweet,
    };
    console.log(body);

    return this.http.post(this.apiURL + 'api/tweets/create', body, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }
  // Error handling
 //handleError(error : any) {
   //let errorMessage = '';
   //if(error.error instanceof ErrorEvent) {
     // Get client-side error
     //errorMessage = error.error.message;
   //} else {
     // Get server-side error
     //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  // }
  // console.log(errorMessage);
   //window.alert(errorMessage);
   //return throwError(errorMessage);
//}
postTweetWithUrl(tweetText: string, imageUrl: string): Observable<any> {
    const formData = new FormData();
    formData.append("tweet", tweetText || '');
    formData.append("imageUrl", imageUrl);

    const token = this.storageService.getSessionString("token");
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

    return this.http.post(`${this.apiURL}api/tweets/image-url`, formData, { headers })
    .pipe(catchError(this.handleError));
  }
 postTweetWithImage(formData: FormData): Observable<any> {
  const token = this.storageService.getSessionString("token");
  const headers = new HttpHeaders({
    Authorization: 'Bearer ' + token
  });

  return this.http.post(`${this.apiURL}api/tweets/create-with-image`, formData, { headers })
    .pipe(catchError(this.handleError));
}
postImageTweet(tweetData: any): Observable<any> {
  const token = this.storageService.getSessionString("token");
  const headers = new HttpHeaders({
    Authorization: 'Bearer ' + token
  });

  return this.http.post(`${this.apiURL}api/tweets/image-url`, tweetData, { headers })
    .pipe(catchError(this.handleError));
}

  // 🔹 Manejo de errores
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


  
  deleteTweet(tweetId: number): Observable<any> {
  return this.http.delete(`${this.apiURL}api/tweets/${tweetId}`, this.getHttpOptions())
    .pipe(catchError(this.handleError));
}

}
