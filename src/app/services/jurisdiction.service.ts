import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class JurisdictionService {
  private base = `${environment.ipAddUrl}`;
  private token = localStorage.getItem('user_token') ?? '';
  
    private auth = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      });

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    const url = `${this.base}api/jurisdiction/collect`;
    return this.http.get(url, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }

  getStation(stationId: number): Observable<any> {
    const url = `${this.base}api/jurisdiction/retrieve/${stationId}`;
    return this.http.get(url, {headers: this.auth}).pipe(
      catchError(this.handleError)
    );
  }


  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
