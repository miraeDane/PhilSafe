import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Nationalities } from '../models/description';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  private nationalities = 'assets/nationalities.json';
  private descriptionUrl = environment.ipAddUrl;
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

  getNationalities(): Observable<Nationalities> {
    return this.http.get<Nationalities>(this.nationalities);
  }


  retrieveUnknowns(): Observable<any> {
    const url = `${this.descriptionUrl}api/description/unidentified`;
    return this.http.get(url, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  retrieveKnowns(): Observable<any> {
    const url = `${this.descriptionUrl}api/description/identified`;
    return this.http.get(url, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  
  establishDescription(data: any): Observable<any> {
    const url = `${this.descriptionUrl}api/description`;
    return this.http.post(url, data, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  editDescription(id: number, data: any): Observable<any> {
    const url = `${this.descriptionUrl}api/description/up/${id}`;
    return this.http.put(url, data, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  discardDescription(id: number): Observable<any> {
    const url = `${this.descriptionUrl}api/description/discard/${id}`;
    return this.http.delete(url, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
