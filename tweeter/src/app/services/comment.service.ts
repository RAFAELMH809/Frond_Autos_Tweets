import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comments/Comment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private API_URL = 'http://localhost:8080/api/comments'; // ajusta si es diferente

  constructor(
  private http: HttpClient,
  private storageService: StorageService
) {}

  private getAuthHeaders(): HttpHeaders {
  const token = this.storageService.getSessionString('token'); // ✅ usar string
  console.log("TOKEN en comment.service:", token);

  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
}


getCommentsByTweet(tweetId: number): Observable<Comment[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<Comment[]>(
    `${this.API_URL}/tweet/${tweetId}`,
    { headers }
  );
}


  postComment(tweetId: number, content: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/add`,
      { tweetId, content },
      { headers: this.getAuthHeaders() }
    );
  }
}