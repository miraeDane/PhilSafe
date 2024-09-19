import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VictimService {
  private victimUrl = 'http://localhost:7108/api/victim'; 

  constructor(private http: HttpClient) {}

  collectVictims(): Observable<any> {
    return this.http.get(`${this.victimUrl}/retrieve/all`).pipe(
      catchError(this.handleError)
    );
  }

 
  ascertainVictim(id: number): Observable<any> {
    return this.http.get(`${this.victimUrl}/retrieve/${id}`).pipe(
      catchError(this.handleError)
    );
  }

 
  collectAffectedCases(id: number): Observable<any> {
    return this.http.get(`${this.victimUrl}/retrieve/cases/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  establishVictim(victim: any): Observable<any> {
    return this.http.post(`${this.victimUrl}`, victim).pipe(
      catchError(this.handleError)
    );
  }

  editVictim(id: number, victim: any): Observable<any> {
    return this.http.put(`${this.victimUrl}/edit/${id}`, victim).pipe(
      catchError(this.handleError)
    );
  }


  discardVictim(id: number): Observable<any> {
    return this.http.delete(`${this.victimUrl}/discard/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
