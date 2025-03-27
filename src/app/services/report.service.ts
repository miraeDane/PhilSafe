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
      
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

  collectAllReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/nationwide`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  
  collectLocalReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/local`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

 
  getReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/citizen`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  
  collectCategorizedReports(subcategoryId: number): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/category/${subcategoryId}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  collectCrimeReports(crimeId: number): Observable<any> {
    return this.http.get(`${this.reportUrl}api/report/retrieve/case/${crimeId}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  establishReport(reportDto: any): Observable<any> {
    const header = new HttpHeaders({
      'Content-Type': 'multipart/form-data; boundary=' + this.generateBoundary(),
      'Authorization': this.token
    })
    return this.http.post(`${this.reportUrl}api/report`, reportDto, {headers: header}).pipe(
      catchError(this.handleError)
    );
  }

  updateReport(id: number, reportDto: any): Observable<any> {
    return this.http.put(`${this.reportUrl}api/report/up/${id}`, reportDto, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  generateBoundary() {
    return '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  }

 
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}


