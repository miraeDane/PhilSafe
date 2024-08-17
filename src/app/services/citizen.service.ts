import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  private citizenUrl = 'http://localhost:5100/api/citizen';

  constructor(private http: HttpClient) {}

  


  verifyRegularStatus(personId: number): Observable<boolean> {
    const url = `${this.citizenUrl}/verify/${personId}`;
    return this.http.get<boolean>(url).pipe(
      catchError(this.handleError)
    );
  }



  establishCitizen(data: any): Observable<any> {
    const url = `${this.citizenUrl}/identity/flesh`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  ascertainCitizen(data: any): Observable<any> {
    const url = `${this.citizenUrl}/identity/prove`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError)
    );
  }


  certifyCitizen(personId: number, accountId: number): Observable<any> {
    const url = `${this.citizenUrl}/certify/${personId}/acc/${accountId}`;
    return this.http.put(url, {}).pipe(
      catchError(this.handleError)
    );
  }


 
  deleteCitizen(personId: number): Observable<any> {
    const url = `${this.citizenUrl}/banish/citizen/${personId}`;
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
