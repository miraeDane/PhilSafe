import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  
  // private accountURL = 'https://localhost:7108/api/account';
  private accountURL = environment.ipAddUrl;
  private loggedIn = false;
  private tokenKey = 'auth_token';
  private options = { 
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json' 
    })
  };

  constructor(private http: HttpClient) {}



  isAuthenticated(): boolean {
    return true;
  }


  
   loginByEmail(data: any): Observable<any> {
    this.loggedIn = true;
    const url = `${this.accountURL}api/account/login`;
    return this.http.post<{ token: string, personId: number }>(url, data, this.options).pipe(
      catchError(this.handleError),
      map(response => {
        if (response && response.token) {
          this.storeSession(response.token);
          console.log('Login response:', response);
        }
        return response;
      })
    );
  }

 
  loginByContactNumber(data: any): Observable<any> {
    this.loggedIn = true;
    const url = `${this.accountURL}api/account/login`;
    return this.http.post<{ token: string, personId: number }>(url, data, this.options).pipe(
      catchError(this.handleError),
      map(response => {
        if (response && response.token) {
          this.storeSession(response.token);
          console.log('Login response:', response);
        }
        return response;
      })

    );
  }


  verifyPasswordByEmail(data: any): Observable<any> {
    const url = `${this.accountURL}api/account/verify/email`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  verifyPasswordByContact(data: any): Observable<any> {
    const url = `${this.accountURL}api/account/verify/contact`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  signOut(): Observable<any> {
    this.loggedIn = false; 
    const url = `${this.accountURL}api/account/signout`;
    return this.http.post(url, {}).pipe(
      catchError(this.handleError),
      map(response =>{
        if (response) {
          localStorage.removeItem('sessionData');
          localStorage.removeItem('citizenId');
          console.log('Sign-out response:', response);
        }
        return response;
      })
    );
  }

  private storeSession(token: string) {
    const expirationTime = new Date().getTime() + 30 * 60 * 1000;
    const sessionData = { token, expirationTime };
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  }

  checkSession(): boolean {
    const sessionData = localStorage.getItem('sessionData');
    if (!sessionData) return false;
  
    const { expirationTime } = JSON.parse(sessionData);
    return new Date().getTime() < expirationTime;
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


  // loginWithContactNum(data: any): Observable<any> {
  //   return this.http.post(`${this.personUrl}/login/contactNum`, data).pipe(
  //     catchError((error) => {
  //       console.error('Error occured while posting the data', error);
  //       return throwError(error);
  //     })
  //   );
  // }
}
