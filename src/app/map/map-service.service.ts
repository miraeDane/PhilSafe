import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface MapServiceService {
  attribution: string;
  features: Feature[];
  query: [];
}

export interface Feature {
  place_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  constructor(private http: HttpClient) { }

  // search_word(query: string){
  //   const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  //   return this.http.get(url + query + '.json?type=address&access_token=' + environment.mapbox.accessToken)
  //   .pipe(map((res: any)=>{
  //     return res.features;
  //   }));
  // }
}
