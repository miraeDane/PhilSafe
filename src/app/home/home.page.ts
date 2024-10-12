import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Person } from '../models/person';
import { CreateAccountData } from '../models/create-account-data';
import { LoginService } from '../services/login.service';
import { PersonService } from '../services/person.service';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  personData: Person = {
    personId: 0,
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
  };
 
  accountData: CreateAccountData = {
    email: '',
    password: '',
    telNum: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId: 0,
    role: 'user',
    personId: 0,
    profile_pic: new Uint16Array
  };

  avatarUrl: string = 'assets/user-default.jpg';
  personId: number = 0;
  latitude: number | null = null;
  longitude: number | null = null;
  locationError: string = '';
  locationName: string = 'Your current location is unknown.';
  stationName: string = 'Unknown Station';
  solvedCrimesCount: number = 0;
  totalSolvedCrimesCount: number = 0;
  solvedCrimesPerStation: number = 0;
  policeStations: any[] = [];



  constructor(
    private menu: MenuController,
    private loginService: LoginService,
    private accountService: AccountService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
    
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserProfile();
    });
  }
  
  ngAfterViewInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
        const userData = navigation.extras.state['userData'];
        if (userData) {
            this.loadUserProfile(); 
        }
    }
}

  ngOnInit() {

    this.loadUserProfile();
    this.cdr.detectChanges();
    this.getCurrentLocation();
    this.getSolvedCrimes(7);
    this.getTotalSolvedCrimes();
    this.loadPoliceStations();
    
  }

 

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('Latitude:', this.latitude);
          console.log('Longitude:', this.longitude);
          this.getLocationName(this.latitude, this.longitude).then((name) => {
            this.locationName = name; // Set the location name
          }).catch((error) => {
            console.error(error);
            this.locationName = 'Could not retrieve location name.';
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          this.locationName = this.handleLocationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      this.locationName = 'Geolocation is not supported by this browser.';
      console.error(this.locationName);
    }
  }


  async getSolvedCrimes(stationId: number): Promise<number> { // Change return type to Promise<number>
    const url = `https://172.30.8.253:7108/api/case/retrieve/local/${stationId}`;
    return this.http.get<any[]>(url).toPromise().then((cases) => {
        if (cases) {
            const count = cases.filter(c => c.status.trim() === 'Solved').length;
            console.log('Total Solved Crimes:', count);
            return count; // Return the count
        } else {
            return 0; // Return 0 if no cases found
        }
    }).catch((error) => {
        console.error('Error fetching solved crimes:', error);
        return 0; // Return 0 on error
    });
}

  async getTotalSolvedCrimes() {
    try {
        const totalSolvedCrimes = await Promise.all(
            Array.from({ length: 11 }, (_, i) => this.getSolvedCrimes(i + 1))
        );

        console.log('Solved crimes per station:', totalSolvedCrimes);

        // Ensure totalSolvedCrimes contains only numbers and handle undefined values
        this.totalSolvedCrimesCount = totalSolvedCrimes.reduce((sum, count) => sum + count);

        console.log('Total Solved Crimes from all stations:', this.totalSolvedCrimesCount);
    } catch (error) {
        console.error('Error fetching total solved crimes:', error);
        this.totalSolvedCrimesCount = 0; // Optionally reset the count on error
    }
}

  
  

  getLocationName(latitude: number, longitude: number): Promise<string> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${environment.mapboxKey}&types=locality,neighborhood&limit=1`;

    return new Promise((resolve, reject) => {
        this.http.get<any>(url).subscribe(
            (response: { features: { text: string }[] }) => { // Add type annotation here
                const features = response?.features || [];
                let barangayName = 'Unknown location';

                if (features.length > 0) {
                    barangayName = features[0].text || 'Unknown location';
                }

                resolve(barangayName);
            },
            (error: any) => { // Add type annotation here
                console.error('Error fetching location name:', error);
                reject('Unknown location');
            }
        );
    });
}


loadPoliceStations() {
  this.http.get<any[]>('assets/location/jurisdiction.json').subscribe(
    (data) => {
      this.policeStations = data; 
      console.log('Loaded police stations:', this.policeStations);
      this.getSolvedCrimesForLocation(); 
    },
    (error) => {
      console.error('Error loading police stations:', error);
    }
  );
}

async getSolvedCrimesForLocation() {
  const locationName = this.locationName; 
  const station = this.policeStations.find(station => 
    station.jurisdiction.includes(locationName),
    console.log('Location Name hereee', locationName)
  );

  if (station) {
    console.log(`Found station: ${station.stationName} with ID: ${station.stationId}`);
    const totalSolvedCrimes = await this.getSolvedCrimes(station.stationId);
    console.log(`Total solved crimes for ${station.stationName}: ${totalSolvedCrimes}`);
  } else {
    console.log('No station found for the current location.');
  }
}

  handleLocationError(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'User denied the request for Geolocation.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.';
      case error.TIMEOUT:
        return 'The request to get user location timed out.';
      default:
        return 'An unknown error occurred.';
    }
  }
  


  loadUserProfile() {
    setTimeout(() => {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          this.personData = {
            personId: parsedData.personId || 0,
            firstname: this.capitalizeWords(parsedData.first_name || ''),
            middlename: parsedData.middle_name || '',
            lastname: this.capitalizeWords(parsedData.last_name || ''),
            sex: '',
            birthdate: '',
            civilStatus: '',
            bioStatus: true,
          };

          this.accountData = {
            email: parsedData.email || '',
            password: '',
            telNum: '',
            contactNum: '',
            homeAddressId: 0,
            workAddressId: 0,
            role: '',
            personId: parsedData.personId || 0,
            profile_pic: new Uint16Array(),
          };

        
          // console.log('Person Data from Session:', this.personData);
          // console.log('Account Data from Session:', this.accountData);
        } catch (e) {
          console.error('Failed to parse userData from session:', e);
        }
      } else {
        console.log('No userData found in session storage.');
      }
    }, 100);

    
  }

  resetUserData() {
    
    this.personData = {
      personId: 0,
      firstname: '',
      middlename: '',
      lastname: '',
      sex: '',
      birthdate: '',
      civilStatus: '',
      bioStatus: true,
    };
 
    this.accountData = {
      email: '',
      password: '',
      telNum: '',
      contactNum: '',
      homeAddressId: 0,
      workAddressId: 0,
      role: 'Certified',
      personId: 0,
      profile_pic: new Uint16Array
    };
  }

  capitalizeWords(string: string): string {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }


  disableScroll() {
    document.body.classList.add('no-scroll');
  }

  enableScroll() {
    document.body.classList.remove('no-scroll');
  }

  logout() {
    this.loginService.signOut().subscribe(
      (response) => {
        console.log('Signed out successfully:', response);
        this.clearSession();
        localStorage.setItem('authenticated', '0');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error during sign out:', error);
      }
    );
  } 

  clearSession() {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('citizenId');
    localStorage.removeItem('sessionData');
    this.resetUserData();
    localStorage.clear();
    sessionStorage.clear();

  }

  editProfile(personId: number) {
      
      // console.log("Navigating to edit profile edit with person id:", personId);
      this.router.navigate(['tabs/home/edit-profile']);
  }

}
