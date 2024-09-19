import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RelationshipService {
  private relUrl = 'https://localhost:7108/api/relationship'; 

  constructor(private http: HttpClient) {}


  getConnection(id: number): Observable<any> {
    return this.http.get(`${this.relUrl}/single/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getConnections(personId: number): Observable<any> {
    return this.http.get(`${this.relUrl}/multiple/${personId}`).pipe(
      catchError(this.handleError)
    );
  }

  establishConnection(relDto: any): Observable<any> {
    return this.http.post(`${this.relUrl}`, relDto).pipe(
      catchError(this.handleError)
    );
  }

  
  changeConnection(id: number, relDto: any): Observable<any> {
    return this.http.put(`${this.relUrl}/update/${id}`, relDto).pipe(
      catchError(this.handleError)
    );
  }

  cutConnection(id: number): Observable<any> {
    return this.http.delete(`${this.relUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
