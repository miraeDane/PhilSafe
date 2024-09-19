import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WitnessService {
  private witnessUrl = 'https://localhost:7108/api/witness'; 

  constructor(private http: HttpClient) {}

 
  establishWitness(personId: number): Observable<any> {
    return this.http.post(`${this.witnessUrl}/establish/${personId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  
  collectWitness(id: number): Observable<any> {
    return this.http.get(`${this.witnessUrl}/select/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
