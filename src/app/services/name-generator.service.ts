import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NameGeneratorService {

  private namesUrl = 'assets/names.json';  // Path to your JSON file

  constructor(private http: HttpClient) { }


  getNames(): Observable<any> {
    return this.http.get<any>(this.namesUrl);
  }

  // generateRandomName(gender: string): Promise<string> {
  //   const randomIndex = (array: any[]) => Math.floor(Math.random() * array.length);
  
  //   return this.getNames()
  //     .toPromise()
  //     .then(names => {
  //       const firstName = names[gender][randomIndex(names[gender])];
  //       const middleName = names.last_name[randomIndex(names.last_name)];
  //       const lastName = names.last_name[randomIndex(names.last_name)];
  //       return `${firstName} ${middleName} ${lastName}`;
  //     });
  // }

  generateRandomName(gender: string): Promise<string> {
    const randomIndex = (array: any[]) => {
      if (!array || array.length === 0) {
        console.error("Array is empty or undefined");
        return 0; // Default to 0 if array is empty or undefined
      }
      return Math.floor(Math.random() * array.length);
    };
  
    return this.getNames()
      .toPromise()
      .then(names => {
        if (!names || !names[gender] || !names.last_name) {
          console.error("Names object or required arrays are missing");
          return ''; // Return an empty string if data is not available
        }
  
        const firstName = names[gender][randomIndex(names[gender])];
        const middleName = names.last_name[randomIndex(names.last_name)]; 
        const lastName = names.last_name[randomIndex(names.last_name)];
  
        return `${firstName} ${middleName} ${lastName}`; 
      })
      .catch(error => {
        console.error("Error generating name:", error);
        return ''; 
      });
  }
  
  
}
