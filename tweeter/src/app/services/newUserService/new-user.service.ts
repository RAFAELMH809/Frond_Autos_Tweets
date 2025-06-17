import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user/User';

@Injectable({
    providedIn: 'root'
  })
  export class NewUserService {
  apiURL = 'http://localhost:8080/'; 

    constructor(private http: HttpClient) {}

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        //'Access-Control-Allow-Origin': '*'
      })
    };
  
    

signUp(myUser: User): Observable<any> {
    const body = {
      username: myUser.username,
      email: myUser.email,
      password: myUser.password,
      role: ["ROLE_USER"] // Puedes cambiar esto según el rol que quieras asignar
    };
  
    console.log("Payload enviado a la API:", body);
  
    return this.http.post(this.apiURL + 'api/auth/signup', body, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent){
      errorMessage = error.error.message;
  } else {
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

  