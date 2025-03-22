import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuspectService {
  private suspectUrl = environment.ipAddUrl;
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

 
  establishSuspect(suspect: any): Observable<any> {
    return this.http.post(`${this.suspectUrl}api/suspect`, suspect, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  
  editSuspect(id: number, suspect: any): Observable<any> {
    return this.http.put(`${this.suspectUrl}api/suspect/edit/${id}`, suspect, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  establishCriminal(reportId: number, suspectRequest: any): Observable<any> {
    const url = `${this.suspectUrl}api/suspect/fromreport/${reportId}`;
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });

    return this.http.post(url, suspectRequest, {headers: this.auth})
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError(() => new Error('Failed to establish criminal. Please try again.'));
        })
      );
  }


  deleteSuspect(id: number): Observable<any> {
    return this.http.delete(`${this.suspectUrl}api/suspect/discard/${id}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
