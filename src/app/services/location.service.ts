import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Province, Region, Municipality, Barangay } from '../models/location-data';
import { Cluster, Coordinates } from '../models/location';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private regionUrl = 'assets/location/table_region.json';
  private provinceUrl = 'assets/location/table_province.json';
  private municipalityUrl = 'assets/location/table_municipality.json';
  private barangayUrl = 'assets/location/table_barangay.json';
  private cebuBarangays = 'assets/location/cebu_barangay.json';
  private locationURL = environment.ipAddUrl;
  // private coordinates = 'https://localhost:7108/api';
  private options = { 
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json' 
    })
  };
  private token = localStorage.getItem('user_token') ?? '';

  private auth = new HttpHeaders({
      'Authorization': this.token
    });


  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.regionUrl);
  }

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(this.provinceUrl);
  }

  getMunicipalities(): Observable<Municipality[]> {
    return this.http.get<Municipality[]>(this.municipalityUrl);
  }

  getBarangays(): Observable<Barangay[]> {
    return this.http.get<Barangay[]>(this.barangayUrl);
  }

  getCebuBarangays(): Observable<Barangay[]> {
    return this.http.get<Barangay[]>(this.cebuBarangays);
  }

  // getCoordinates(): Observable<Cluster[]> {
  //   return this.http.get<Cluster[]>(`${this.locationURL}api/location/retrieve/mapcoordinates`, {headers: this.auth});
    
  // }

  // getFullCoordinates(incidentID: number): Observable<Cluster[]> {
  //   return this.http.get<Cluster[]>(`${this.locationURL}api/location/retrieve/mapcoordinates/${incidentID}`, {headers: this.auth});
  // }
  
  getCoordinates(): Observable<Cluster[]> {
    return this.http.get<Cluster[]>(`${this.locationURL}api/location/retrieve/mapcoordinates`, {headers: this.auth}).pipe(
      map(clusters => 
        clusters.sort((a, b) => {
          const nameA = a.barangay || ''; // Fallback to an empty string if undefined
          const nameB = b.barangay || ''; // Fallback to an empty string if undefined
          return nameA.localeCompare(nameB);
        })
      )
    );
  }
  
  getFullCoordinates(incidentID: number): Observable<Cluster[]> {
    return this.http.get<Cluster[]>(`${this.locationURL}api/location/retrieve/mapcoordinates/${incidentID}`, {headers: this.auth}).pipe(
      map(clusters => 
        clusters.sort((a, b) => {
          const nameA = a.barangay || ''; // Fallback to an empty string if undefined
          const nameB = b.barangay || ''; // Fallback to an empty string if undefined
          return nameA.localeCompare(nameB);
        })
      )
    );
  }




  createOrRetrieveLocation(locationData: any, zipCode: number): Observable<any> {
    return this.http.post(
      `${this.locationURL}api/location/create/${zipCode}`, 
      locationData, 
      { ...this.options, observe: 'response', headers: this.auth }
    ).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 200) {
          return { locationFound: true, locationId: response.body.id }; 
        } else if (response.status === 302) {
          console.warn('Location found, but redirected:', response);
          return { locationFound: true, locationId: response.headers.get('Location') };
        } else {
          return { locationFound: false, locationId: null };
        }
      }),
      catchError(this.handleError)
    );
  }

    getLocation(locationId: number): Observable<any> {
      return this.http.get(`${this.locationURL}api/location/retrieve/${locationId}`, { observe: 'response', headers: this.auth })
        .pipe(
          map((response: HttpResponse<any>) => {
            if (response.status === 200) {
              console.log('RESPONSE FROM LOCATION SERVICE', response.body)
              return response.body;
            } else {
              console.log('RESPONSE FROM LOCATION SERVICE', response.body)
              return null;
            }
          }),
          catchError(this.handleError)
        );
    }

    getAllLocation(): Observable<Location[]> {
      return this.http.get<Location[]>(`${this.locationURL}api/location/retrieve/all`, { observe: 'response', headers: this.auth })
        .pipe(
          map((response: HttpResponse<Location[]>) => {
            if (response.status === 200) {
              return response.body || [];
            } else {
              return [];
            }
          }),
          catchError(this.handleError)
        );
    }
    

    updateLocation(id: number, data: any): Observable<any> {
      const url = `${this.locationURL}api/up/${id}`;
      return this.http.put(url, data, {headers: this.auth}).pipe(
        catchError(this.handleError)
      );
    }
  

    deleteLocation(id: number): Observable<any> {
      const url = `${this.locationURL}api/del/${id}`;
      return this.http.delete(url, {headers: this.auth}).pipe(
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


