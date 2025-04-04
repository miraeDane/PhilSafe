import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionUrl = environment.ipAddUrl; 
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

  // Collect all nationwide transaction records
  collectNationWideRecords(): Observable<any> {
    return this.http.get(`${this.transactionUrl}api/transaction/collect/nationwide`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  // Collect transactions for a specific citizen
  collectTheirRecords(id: number): Observable<any> {
    return this.http.get(`${this.transactionUrl}api/transaction/collect/citizen/${id}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  // Collect a specific report receipt
  collectReportReceipt(id: number): Observable<any> {
    return this.http.get(`${this.transactionUrl}api/transaction/collect/report/${id}`, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  // Process a transaction
  transactBlotter(transaction: any): Observable<any> {
    return this.http.post(`${this.transactionUrl}api/transaction/pay`, transaction, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
