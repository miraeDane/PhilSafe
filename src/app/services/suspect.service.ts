import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuspectService {
  private suspectUrl = 'https://localhost:7108/api/suspect';

  constructor(private http: HttpClient) {}

 
  retrieveAllSuspects(): Observable<any> {
    return this.http.get(`${this.suspectUrl}/collect/all`).pipe(
      catchError(this.handleError)
    );
  }


  retrieveAllPrisoners(): Observable<any> {
    return this.http.get(`${this.suspectUrl}/collect/prison`).pipe(
      catchError(this.handleError)
    );
  }


  retrieveAllWanteds(): Observable<any> {
    return this.http.get(`${this.suspectUrl}/collect/freedom`).pipe(
      catchError(this.handleError)
    );
  }

 
  identifySuspect(id: number): Observable<any> {
    return this.http.get(`${this.suspectUrl}/verify/${id}`).pipe(
      catchError(this.handleError)
    );
  }

 
  establishSuspect(suspect: any): Observable<any> {
    return this.http.post(`${this.suspectUrl}`, suspect).pipe(
      catchError(this.handleError)
    );
  }

  
  editSuspect(id: number, suspect: any): Observable<any> {
    return this.http.put(`${this.suspectUrl}/edit/${id}`, suspect).pipe(
      catchError(this.handleError)
    );
  }


  deleteSuspect(id: number): Observable<any> {
    return this.http.delete(`${this.suspectUrl}/discard/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
