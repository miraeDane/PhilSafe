import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WitnessService {
  private witnessUrl = environment.ipAddUrl; 
  private token = localStorage.getItem('token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

 
  establishWitness(personId: number): Observable<any> {
    return this.http.post(`${this.witnessUrl}api/witness/establish/${personId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  
  collectWitness(id: number): Observable<any> {
    return this.http.get(`${this.witnessUrl}api/witness/select/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
