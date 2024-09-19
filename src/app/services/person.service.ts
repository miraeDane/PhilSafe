import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  // private personURL = 'https://localhost:7108/api/person';
  private personURL = 'https://192.168.120.11:7108/api/person';

  constructor(private http: HttpClient) { }


  createPerson(data: any): Observable<any> {
    return this.http.post(this.personURL, data).pipe(
      catchError(this.handleError)
    );
  }



  getPerson(personId: number): Observable<any> {
    return this.http.get(`${this.personURL}/retrieve/${personId}`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200) {
            console.log('RESPONSE FROM PERSON SERVICE', response.body)
            return response.body;
          } else {
            console.log('RESPONSE FROM PERSON SERVICE', response.body)
            return null;
          }
        }),
        catchError(this.handleError)
      );
  }

update(id: number, pDto: any): Observable<any> {
  return this.http.put(`${this.personURL}/up/${id}`, pDto).pipe(
    catchError(this.handleError)
  );
}

delete(id: number): Observable<any> {
  return this.http.delete(`${this.personURL}/delete/${id}`).pipe(
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
