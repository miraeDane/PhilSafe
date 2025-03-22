import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccountService {


  // private accountURL = 'https://localhost:7108/api/account';
  private accountURL = environment.ipAddUrl;
  private loggedIn = false;
  private tokenKey = 'auth_token';
  private options = { 
    headers: new HttpHeaders({ 
      'Content-Type': 'multipart/form-data' 
    })
  };
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Authorization': this.token
    });

  
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
    const url = `${this.accountURL}api/account/signup`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }


  upgradeAccount(data: any): Observable<any> {
    const url = `${this.accountURL}api/account/signup/upgrade`;
    return this.http.post(url, data, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  getAccount(): Observable<any> {
    return this.http.get(`${this.accountURL}api/account`, { observe: 'response', headers: this.auth })
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



getProfPic(accountId: number): Observable<Blob> {

  return this.http.get(`${this.accountURL}api/account/get/profilepic`, { 
      headers: this.auth,  
      responseType: 'blob' 
    })
    .pipe(
      tap((response: any) => {
        console.log('Response from getProfPic:', response);
      }),
      catchError(error => {
        console.error('Error fetching profile picture:', error);
        return throwError(error);
      })
    );
}


 
  updateAccount(id: number, data: any): Observable<any> {
    const url = `${this.accountURL}api/account/up/${id}`;
    return this.http.put(url, data, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  updateProfPic(id: number, data: any): Observable<any> {
    const url = `${this.accountURL}api/account/update/profilepic/${id}`;
    
    return this.http.put(url, data).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(data: any): Observable<any> {
    const url = `${this.accountURL}api/account/reset/password`;
    return this.http.put(url, data, {headers: this.auth}).pipe(
      tap((response) => {
        console.log('Password reset successful:', response);
      }),
      catchError(this.handleError)
    );
  }

 
  deleteAccount(id: number): Observable<any> {
    const url = `${this.accountURL}api/account/discard/${id}`;
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


