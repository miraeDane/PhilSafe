import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OccupationService {
  private apiUrl = `${environment.ipAddUrl}api/occupation`;

  constructor(private http: HttpClient) { }

  loadProperOccupations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/load/proper`).pipe(
      catchError(this.handleError)
    );
  }

  createOccupation(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, JSON.stringify(name), {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error);
    return throwError(() => error.message || 'An unknown error occurred');
  }
}