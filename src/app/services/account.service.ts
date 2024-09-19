import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  // private accountURL = 'https://localhost:7108/api/account';
  private accountURL = 'https://192.168.120.11:7108/api/account';
  private loggedIn = false;
  private tokenKey = 'auth_token';

  
  constructor(private http: HttpClient) { }

  // postAccount(data: any): Observable<any> {
  //   return this.http.post(`${this.accountURL}/signup`, data).pipe(
  //     catchError((error) => {
  //       console.error('Error occured while posting the data', error);
  //       return throwError(error);
  //     })
  //   );
  // }



 

 
  signUp(data: any): Observable<any> {
    const url = `${this.accountURL}/signup`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }


  upgradeAccount(data: any): Observable<any> {
    const url = `${this.accountURL}/signup/upgrade`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  getAccount(): Observable<any> {
    return this.http.get(`${this.accountURL}`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log('RESPONSE FROM ACCOUNT SERVICE', response.body)
            return response.body;
    
          } else {
            console.log('RESPONSE FROM ACCOUNT SERVICE', response.body)
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

 
  updateAccount(id: number, data: any): Observable<any> {
    const url = `${this.accountURL}/up/${id}`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError)
    );
  }

 
  deleteAccount(id: number): Observable<any> {
    const url = `${this.accountURL}/discard/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }



  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}


