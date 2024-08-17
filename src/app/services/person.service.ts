import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private personURL = 'http://localhost:5100/api/person';

  constructor(private http: HttpClient) { }

  createOrRetrievePerson(personData: any): Observable<any> {
    return this.http.post(`${this.personURL}`, personData, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200) {
            return { personFound: true, personId: response.body.id }; 
          } else if (response.status === 302) {
            console.warn('Person found, but redirected:', response);
            return { personFound: true, personId: response.headers.get('Location') };
          } else {
            return { personFound: false, personId: null };
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
