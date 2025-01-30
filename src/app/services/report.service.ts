import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportUrl = environment.ipAddUrl; 
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

  collectAllReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/nationwide`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

  
  collectLocalReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/local`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

 
  getReports(citizenId: any): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/citizen/${citizenId}`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

  
  collectCategorizedReports(subcategoryId: number): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/category/${subcategoryId}`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

  collectCrimeReports(crimeId: number): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/case/${crimeId}`, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

  establishReport(reportDto: any): Observable<any> {
  
    return this.http.post(`${this.reportUrl}api/report`, reportDto, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

  updateReport(id: number, reportDto: any): Observable<any> {
    return this.http.put(`${this.reportUrl}api/report/up/${id}`, reportDto, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

 
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
