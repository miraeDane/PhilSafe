import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  private citizenUrl = environment.ipAddUrl;
  // private citizenUrl = 'https://192.168.181.11:7108/api/citizen';
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

  getCitizens(): Observable<any> {
    return this.http.get(`${this.citizenUrl}api/citizen/collect/citizens/all`, {withCredentials: true});
  }

  uploadMugshot(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.citizenUrl}api/citizen/identity/pic`, formData, {withCredentials: true})
  }

  verifyRegularStatus(personId: number): Observable<boolean> {
    const url = `${this.citizenUrl}api/citizen/verify/${personId}`;
    return this.http.get<boolean>(url, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }



  establishCitizen(data: any): Observable<any> {
    const url = `${this.citizenUrl}api/citizen/identity/flesh`;
    return this.http.post(url, data, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }

  updateCitizen(data: any, citizenId: number): Observable<any> {
    const url = `${this.citizenUrl}api/citizen/submit/proof/${citizenId}`;
    return this.http.put(url, data).pipe(
      catchError(this.handleError)
    );
  }


  certifyCitizen(personId: number, accountId: number): Observable<any> {
    const url = `${this.citizenUrl}api/citizen/certify/${personId}/acc/${accountId}`;
    return this.http.put(url, {withCredentials: true}).pipe(
      catchError(this.handleError)
    );
  }


 
  deleteCitizen(personId: number): Observable<any> {
    const url = `${this.citizenUrl}api/citizen/banish/citizen/${personId}`;
    return this.http.delete(url, {withCredentials: true}).pipe(
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
