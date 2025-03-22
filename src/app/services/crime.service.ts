import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IncidentType } from '../models/incident-type';

@Injectable({
  providedIn: 'root'
})
export class CrimeService {
  private crimeUrl = environment.ipAddUrl;
  private crimeLists = 'assets/crimes';
  private modusLists = 'assets/modus';
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

 

  getIndexCrimes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.crimeLists}/index.json`);  
  }

  getNonIndexCrimes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.crimeLists}/non-index.json`); 
  }

  getModus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.modusLists}/modus.json`); 
  }

  loadIncidentTypes(): Observable<IncidentType[]> {
    return this.http.get<IncidentType[]>(`${this.crimeUrl}api/case/load/incidenttypes`, { headers: this.auth})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
