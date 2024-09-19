import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportUrl = 'https://localhost:7108/api/report'; 

  constructor(private http: HttpClient) {}

  // Collect all nationwide reports
  collectAllReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}/retrieve/nationwide`).pipe(
      catchError(this.handleError)
    );
  }

  // Collect local reports
  collectLocalReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}/retrieve/local`).pipe(
      catchError(this.handleError)
    );
  }

  // Collect reports for a specific citizen
  collectTheirReports(): Observable<any> {
    return this.http.get(`${this.reportUrl}/retrieve/citizen`).pipe(
      catchError(this.handleError)
    );
  }

  // Collect categorized reports by subcategory ID
  collectCategorizedReports(subcategoryId: number): Observable<any> {
    return this.http.get(`${this.reportUrl}/retrieve/category/${subcategoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Collect reports for a specific crime ID
  collectCrimeReports(crimeId: number): Observable<any> {
    return this.http.get(`${this.reportUrl}/retrieve/case/${crimeId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Establish a new report
  establishReport(reportDto: any): Observable<any> {
    return this.http.post(`${this.reportUrl}`, reportDto).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing report by ID
  updateReport(id: number, reportDto: any): Observable<any> {
    return this.http.put(`${this.reportUrl}/up/${id}`, reportDto).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
