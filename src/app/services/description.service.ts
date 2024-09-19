import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Nationalities } from '../models/description';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  private nationalities = 'assets/nationalities.json';
  private descriptionUrl = 'https://localhost:7108/api/description';

  constructor(private http: HttpClient) {}

  getNationalities(): Observable<Nationalities> {
    return this.http.get<Nationalities>(this.nationalities);
  }


  retrieveUnknowns(): Observable<any> {
    const url = `${this.descriptionUrl}/unidentified`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  retrieveKnowns(): Observable<any> {
    const url = `${this.descriptionUrl}/identified`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  
  establishDescription(data: any): Observable<any> {
    const url = `${this.descriptionUrl}`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  editDescription(id: number, data: any): Observable<any> {
    const url = `${this.descriptionUrl}/up/${id}`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError)
    );
  }

  discardDescription(id: number): Observable<any> {
    const url = `${this.descriptionUrl}/discard/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
