import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OccupationService {
  private apiUrl = `${environment.ipAddUrl}api/occupation`;
  private token = localStorage.getItem('user_token') ?? '';
  
    private auth = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      });

  constructor(private http: HttpClient) { }

  loadProperOccupations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/load/proper`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  createOccupation(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, JSON.stringify(name), {
      headers: this.auth
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred', error);
    return throwError(() => error.message || 'An unknown error occurred');
  }
}