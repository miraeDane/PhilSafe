import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmtpService {

  private smtpUrl = `${environment.ipAddUrl}api/smtp`; 
  private options = { 
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json' 
      }),
      withCredentials: true
    };
    private pdf = { 
      headers: new HttpHeaders({ 
        'Content-Type': 'application/pdf' 
      })
    };
    private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}




  retrieveReceipt(reportId: number, citizenId: number): Observable<any> {
    //const headers = { 'Content-Type': 'application/json' };
    
    return this.http.get(`${this.smtpUrl}/send/details/${reportId}/${citizenId}`, this.pdf).pipe(
      catchError((error) => {
        console.error('Error sending OTP:', error);
        return throwError(() => error); 
      })
    );
  }
 
  sendOtpCode(email: string): Observable<any> {
    //const headers = { 'Content-Type': 'application/json' };
    
    return this.http.post(`${this.smtpUrl}/send/otp`, JSON.stringify(email), this.options ).pipe(
      catchError((error) => {
        console.error('Error sending OTP:', error);
        return throwError(() => error); 
      })
    );
  }
  
 
  sendEmailDetails(reportId: number, citizenId: number): Observable<any> {
    return this.http.get(`${this.smtpUrl}/send/details/${reportId}/${citizenId}`, this.pdf).pipe(
      catchError((error) => {
        
        console.error('Error sending email details:', error);
        throw error;
      })
    );
  }


  validateOtpCode(Email: string, Code: string): Observable<any> {
    return this.http.post(`${this.smtpUrl}/validate`, { Code, Email }, this.options).pipe(
      catchError((error) => {
       
        console.error('Error validating OTP:', error);
        throw error;
      })
    );
  }
}
