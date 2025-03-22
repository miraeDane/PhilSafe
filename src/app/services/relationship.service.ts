import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelationshipService {
  private relUrl = environment.ipAddUrl; 
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}


  getConnection(id: number): Observable<any> {
    return this.http.get(`${this.relUrl}api/relationship/single/${id}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  getConnections(personId: number): Observable<any> {
    return this.http.get(`${this.relUrl}api/relationship/multiple/${personId}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  establishConnection(relDto: any): Observable<any> {
    return this.http.post(`${this.relUrl}api/relationship`, relDto, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  
  changeConnection(id: number, relDto: any): Observable<any> {
    return this.http.put(`${this.relUrl}api/relationship/update/${id}`, relDto).pipe(
      catchError(this.handleError)
    );
  }

  cutConnection(id: number): Observable<any> {
    return this.http.delete(`${this.relUrl}api/relationship/delete/${id}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
