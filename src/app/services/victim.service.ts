import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VictimService {
  private victimUrl = environment.ipAddUrl; 
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

  collectVictims(): Observable<any> {
    return this.http.get(`${this.victimUrl}api/victim/retrieve/all`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

 
  ascertainVictim(id: number): Observable<any> {
    return this.http.get(`${this.victimUrl}api/victim/retrieve/${id}`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

 
  collectAffectedCases(id: number): Observable<any> {
    return this.http.get(`${this.victimUrl}api/victim/retrieve/cases/${id}`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }


  postVictim(victim: any): Observable<any> {
    const fullUrl = `${this.victimUrl}api/victim`
    console.log('Full URL', fullUrl, {withCredentials: true});
    return this.http.post(fullUrl, victim).pipe(
      catchError(this.handleError)
    );
  }

  establishVictim(victim: any, reportId: number): Observable<any> {
    const fullUrl = `${this.victimUrl}api/victim/fromreport/${reportId}`
    console.log('Full URL', fullUrl);
    return this.http.post(fullUrl, victim, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }


  editVictim(id: number, victim: any): Observable<any> {
    return this.http.put(`${this.victimUrl}api/victim/edit/${id}`, victim, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }


  discardVictim(id: number): Observable<any> {
    return this.http.delete(`${this.victimUrl}api/victim/discard/${id}`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
