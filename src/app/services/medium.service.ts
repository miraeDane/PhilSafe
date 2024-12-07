import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medium } from '../models/medium';

@Injectable({
  providedIn: 'root'
})
export class MediumService {
  private  mediaUrl = environment.ipAddUrl; 

  constructor(private http: HttpClient) {}

  
  collectEvidences(crimeId: number): Observable<any> {
    return this.http.get(`${this.mediaUrl}api/media/collect/evidences/${crimeId}`).pipe(
      catchError(this.handleError)
    );
  }

  
  collectItems(reportId: number): Observable<any> {
    return this.http.get(`${this.mediaUrl}api/media/collect/items/${reportId}`).pipe(
      catchError(this.handleError)
    );
  }

 
  uploadItem(item: File): Observable<any> {
    const formData = new FormData();
    formData.append('item', item);

    return this.http.post(`${this.mediaUrl}api/media/upload/item/test`, formData).pipe(
      catchError(this.handleError)
    );
  }

  uploadItemWithDetails(formData: FormData, reportId: number): Observable<any> {
    return this.http.post(`${this.mediaUrl}api/media/upload/item/citizen/${reportId}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  uploadItems(formData: FormData, reportId: number): Observable<any> {
    return this.http.post(`${this.mediaUrl}api/media/upload/items/citizen/${reportId}`, formData).pipe(
      catchError(this.handleError)
    );
  }
 
  uploadItemsWithDetails(data: any, reportId: number, crimeId: any): Observable<any> {
    const formData = new FormData();
    return this.http.post(`${this.mediaUrl}api/media/upload/items/${reportId}/${crimeId}`, data).pipe(
      catchError(this.handleError)
    );
  }

 
  updateItem(mediaId: number, updateData: any): Observable<any> {
    return this.http.put(`${this.mediaUrl}api/media/update/item/${mediaId}`, updateData).pipe(
      catchError(this.handleError)
    );
  }

 
  private handleError(error: any): Observable<never> {
  let errorMessage = 'An unknown error occurred!';
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred.
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // The backend returned an unsuccessful response code.
    errorMessage = `Error ${error.status}: ${error.message}`;
  }
  console.error('An error occurred:', errorMessage);
  return throwError(errorMessage);
}

}
