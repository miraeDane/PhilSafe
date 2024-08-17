import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private accountURL = 'http://localhost:5100/api/account';

  
  constructor(private http: HttpClient) { }

  // postAccount(data: any): Observable<any> {
  //   return this.http.post(`${this.accountURL}/signup`, data).pipe(
  //     catchError((error) => {
  //       console.error('Error occured while posting the data', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  
   loginByEmail(data: any): Observable<any> {
    const url = `${this.accountURL}/login`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

 
  loginByContactNumber(data: any): Observable<any> {
    const url = `${this.accountURL}/login`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }


  verifyPasswordByEmail(data: any): Observable<any> {
    const url = `${this.accountURL}/verify/email`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  verifyPasswordByContact(data: any): Observable<any> {
    const url = `${this.accountURL}/verify/contact`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  signOut(): Observable<any> {
    const url = `${this.accountURL}/signout`;
    return this.http.post(url, {}).pipe(
      catchError(this.handleError)
    );
  }

 
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


