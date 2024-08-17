import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuspectService {
  private suspectUrl = 'https://your-api-url.com/api/suspect';

  constructor(private http: HttpClient) {}

  // Retrieve all suspects
  retrieveAllSuspects(): Observable<any> {
    return this.http.get(`${this.suspectUrl}/collect/all`).pipe(
      catchError(this.handleError)
    );
  }

  // Retrieve all prisoners
  retrieveAllPrisoners(): Observable<any> {
    return this.http.get(`${this.suspectUrl}/collect/prison`).pipe(
      catchError(this.handleError)
    );
  }

  // Retrieve all wanted suspects
  retrieveAllWanteds(): Observable<any> {
    return this.http.get(`${this.suspectUrl}/collect/freedom`).pipe(
      catchError(this.handleError)
    );
  }

  // Identify a suspect by ID
  identifyCriminal(id: number): Observable<any> {
    return this.http.get(`${this.suspectUrl}/verify/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new suspect
  establishCriminal(suspectDto: any): Observable<any> {
    return this.http.post(`${this.suspectUrl}`, suspectDto).pipe(
      catchError(this.handleError)
    );
  }

  // Edit an existing suspect
  editCriminal(id: number, suspectDto: any): Observable<any> {
    return this.http.put(`${this.suspectUrl}/edit/${id}`, suspectDto).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a suspect by ID
  clearName(id: number): Observable<any> {
    return this.http.delete(`${this.suspectUrl}/discard/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
