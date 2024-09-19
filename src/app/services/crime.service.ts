import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrimeService {
  private crimeUrl = 'https://localhost:7108/api/case';
  private crimeLists = 'assets/crimes';

  constructor(private http: HttpClient) {}

 

  getIndexCrimes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.crimeLists}/index.json`);  
  }

  getNonIndexCrimes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.crimeLists}/non-index.json`); 
  }


  establishCase(data: any): Observable<any> {
    const url = `${this.crimeUrl}`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }



  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
