import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionUrl = 'http://localhost:5100/api/transaction'; 

  constructor(private http: HttpClient) {}

  // Collect all nationwide transaction records
  collectNationWideRecords(): Observable<any> {
    return this.http.get(`${this.transactionUrl}/collect/nationwide`).pipe(
      catchError(this.handleError)
    );
  }

  // Collect transactions for a specific citizen
  collectTheirRecords(id: number): Observable<any> {
    return this.http.get(`${this.transactionUrl}/collect/citizen/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Collect a specific report receipt
  collectReportReceipt(id: number): Observable<any> {
    return this.http.get(`${this.transactionUrl}/collect/report/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Process a transaction
  transactBlotter(transaction: any): Observable<any> {
    return this.http.post(`${this.transactionUrl}/pay`, transaction).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
