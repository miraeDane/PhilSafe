import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Province, Region, Municipality, Barangay } from '../models/location-data';
import { Cluster, Coordinates } from '../models/location';




@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private regionUrl = 'assets/location/table_region.json';
  private provinceUrl = 'assets/location/table_province.json';
  private municipalityUrl = 'assets/location/table_municipality.json';
  private barangayUrl = 'assets/location/table_barangay.json';
  private cebuBarangays = 'assets/location/cebu_barangay.json';
  private locationURL = 'http://localhost:5100/api/location/create/';
  private coordinates = 'http://localhost:5100/api/location/retrieve/mapcoordinates';

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

  getCoordinates(): Observable<Cluster[]> {
    return this.http.get<Cluster[]>(this.coordinates);
  }




  createOrRetrieveLocation(locationData: any, zipCode: number): Observable<any> {
    return this.http.post(`${this.locationURL}${zipCode}`, locationData, { observe: 'response' })
      .pipe(
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

    updateLocation(id: number, data: any): Observable<any> {
      const url = `${this.locationURL}/up/${id}`;
      return this.http.put(url, data).pipe(
        catchError(this.handleError)
      );
    }
  

    deleteLocation(id: number): Observable<any> {
      const url = `${this.locationURL}/del/${id}`;
      return this.http.delete(url).pipe(
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


