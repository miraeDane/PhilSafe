import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TestimonyService {
  private testimonyUrl = `http://localhost:7108/api/testimony`; 

  constructor(private http: HttpClient) {}

 
  uploadAudio(crimeId: number, witnessId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('aud', file);
    
    return this.http.post(`${this.testimonyUrl}/upload/audio/${crimeId}/${witnessId}`, formData).pipe(
      catchError(this.handleError)
    );
  }


  uploadAudios(crimeId: number, witnessId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('auds', file));

    return this.http.post(`${this.testimonyUrl}/upload/audios/${crimeId}/${witnessId}`, formData).pipe(
      catchError(this.handleError)
    );
  }


  uploadText(text: any): Observable<any> {
    return this.http.post(`${this.testimonyUrl}/upload/text`, text).pipe(
      catchError(this.handleError)
    );
  }

 
  uploadTexts(texts: any[]): Observable<any> {
    return this.http.post(`${this.testimonyUrl}/upload/texts`, texts).pipe(
      catchError(this.handleError)
    );
  }

  
  collectTexts(witnessId: number): Observable<any> {
    return this.http.get(`${this.testimonyUrl}/collect/writings/${witnessId}`).pipe(
      catchError(this.handleError)
    );
  }


  collectUploads(witnessId: number): Observable<any> {
    return this.http.get(`${this.testimonyUrl}/collect/audios/${witnessId}`).pipe(
      catchError(this.handleError)
    );
  }

 
  deleteTexts(witnessId: number, text: any): Observable<any> {
    return this.http.put(`${this.testimonyUrl}/edit/text/${witnessId}`, text).pipe(
      catchError(this.handleError)
    );
  }

 
  discardUploads(witnessId: number): Observable<any> {
    return this.http.delete(`${this.testimonyUrl}/discard/audios/${witnessId}`).pipe(
      catchError(this.handleError)
    );
  }


  discardTexts(witnessId: number): Observable<any> {
    return this.http.delete(`${this.testimonyUrl}/discard/texts/${witnessId}`).pipe(
      catchError(this.handleError)
    );
  }

  
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
