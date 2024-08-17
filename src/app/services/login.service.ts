import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountSignInFromContactDto, AccountSignInFromEmailDto, ResultMessage } from '../models/login';
import { CreateAccountData } from '../models/create-account-data';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private personUrl = 'http://localhost:5100/api/account';
  private options = { 
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json' 
    }) 
  };

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.personUrl}/login`, data, this.options).pipe(
      catchError((error) => {
        console.error('Error occured while posting the data', error);
        return throwError(error);
      })
    );
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
