import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';



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
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  
  ) {}



  isAuthenticated(): boolean {
    return true;
  }


  
   loginByEmail(data: any): Observable<any> {
    this.loggedIn = true;
    const url = `${this.accountURL}api/account/login`;
    return this.http.post<{ token: string, personId: number }>(url, data, 
      {
        headers: this.auth
      }
    ).pipe(
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
    return this.http.post<{ token: string, personId: number }>(url, data, {headers: this.auth}).pipe(
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
    return this.http.post(url, data, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  verifyPasswordByContact(data: any): Observable<any> {
    const url = `${this.accountURL}api/account/verify/contact`;
    return this.http.post(url, data, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  // signOut(): Observable<any> {
  //   this.loggedIn = false; 
  //   const url = `${this.accountURL}api/account/signout`;
  //   return this.http.post(url, {}).pipe(
  //     catchError(this.handleError),
  //     map(response =>{
  //       if (response) {
  //         localStorage.removeItem('sessionData');
  //         localStorage.removeItem('citizenId');
  //         console.log('Sign-out response:', response);
  //       }
  //       return response;
  //     })
  //   );
  // }
  signOut(): Observable<any> {
    this.loggedIn = false; 
    const url = `${this.accountURL}api/account/signout`;
  
    return this.http.post(url, {}).pipe(
      catchError(this.handleError),
      map(response => {
        if (response) {
          // Clear Local Storage
          localStorage.removeItem('sessionData');
          localStorage.removeItem('citizenId');
  
          // Clear IndexedDB (if used)
          if ('indexedDB' in window) {
            let databases = indexedDB.databases ? indexedDB.databases() : Promise.resolve([]);
            databases.then((dbs) => {
              dbs.forEach((db) => indexedDB.deleteDatabase(db.name!));
            });
          }
  
          // Clear Service Worker Cache (If applicable)
          if ('caches' in window) {
            caches.keys().then((names) => {
              names.forEach((name) => caches.delete(name));
            });
          }
  
          // Clear session storage
          sessionStorage.clear();
          window.location.reload();
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

  private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred!';
  
    // Check for specific error messages based on status code
    if (error.status === 401) {
      // If the error response contains a custom message
      if (error.error && error.error.message) {
        errorMessage = error.error.message; // For example: "Incorrect Username & Password."
      } else {
        errorMessage = 'Unauthorized, You must be a citizen'; // Fallback message if no custom message
      }
    } else if (error.status === 0) {
      errorMessage = 'Server not found';
    } else if (error.status === 500) {
      errorMessage = 'Internal Server Error';
    }
  
    // Display the error message in an alert
    this.presentAlert(errorMessage);
    return throwError(() => new Error(errorMessage));
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
