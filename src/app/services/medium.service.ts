import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediumService {
  private  mediaUrl = 'https://localhost:5100/api/media'; 

  constructor(private http: HttpClient) {}

  
  collectEvidences(crimeId: number): Observable<any> {
    return this.http.get(`${this.mediaUrl}/collect/evidences/${crimeId}`).pipe(
      catchError(this.handleError)
    );
  }

  
  collectItems(reportId: number): Observable<any> {
    return this.http.get(`${this.mediaUrl}/collect/items/${reportId}`).pipe(
      catchError(this.handleError)
    );
  }

 
  uploadItem(item: File): Observable<any> {
    const formData = new FormData();
    formData.append('item', item);

    return this.http.post(`${this.mediaUrl}/upload/item/test`, formData).pipe(
      catchError(this.handleError)
    );
  }

  uploadItemWithDetails(item: File, reportId: number, crimeId: number): Observable<any> {
    const formData = new FormData();
    formData.append('item', item);

    return this.http.post(`${this.mediaUrl}/upload/item/${reportId}/${crimeId}`, formData).pipe(
      catchError(this.handleError)
    );
  }

 
  uploadItemsWithDetails(items: File[], reportId: number, crimeId: number): Observable<any> {
    const formData = new FormData();
    items.forEach((item, index) => {
      formData.append(`item_${index}`, item);
    });

    return this.http.post(`${this.mediaUrl}/upload/items/${reportId}/${crimeId}`, formData).pipe(
      catchError(this.handleError)
    );
  }

 
  updateItem(mediaId: number, updateData: any): Observable<any> {
    return this.http.put(`${this.mediaUrl}/update/item/${mediaId}`, updateData).pipe(
      catchError(this.handleError)
    );
  }

 
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
