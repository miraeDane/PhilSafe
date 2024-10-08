import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CreateAccountData } from 'src/app/models/create-account-data';
import { Person } from 'src/app/models/person';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { PersonService } from 'src/app/services/person.service';
import { UpgradeAccount } from 'src/app/models/account-upgrade.model';
import { Citizen } from 'src/app/models/citizen';
import { CitizenService } from 'src/app/services/citizen.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  
  currentID = 1;
  personData: Person = {
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
  };
  userHomeAddress: Location = {
    locationId: 0,
    province: '',
    municipality: '',
    street: '',
    region: '',
    barangay: '',
    block: '',
    zipCode: 0,
  };
  userWorkAddress: Location = {
    locationId: 0,
    province: '',
    municipality: '',
    street: '',
    region: '',
    barangay: '',
    zipCode: 0,
  };
  accountData: CreateAccountData = {
    
    email: '',
    password: '',
    telNum: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId: 0,
    role: 'uncertified',
  };


  upgraded: UpgradeAccount = {
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
    email: '',
    password: '',
    telNum: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId: 0,
    role: 'Certified',
    personId: 0,
    profile_pic: new Uint8Array

  };

  citizenData: Citizen = {
    citizenId: 0,
    personId: this.upgraded.personId || 0,
    person: this.upgraded
  };

  confirmPassword: string = '';
  termsAccepted: boolean = false;
  dateOfBirth: string;
  regions: any[] = [];
  provinces: any[] = [];
  municipalities: any[] = [];
  barangays: any[] = [];

   homeProvinces: any[] = [];
   homeMunicipalities: any[] = [];
   homeBarangays: any[] = [];
 
 
   workProvinces: any[] = [];
   workMunicipalities: any[] = [];
   workBarangays: any[] = [];


  selectedHomeRegion: any;
  selectedHomeProvince: any;
  selectedHomeMunicipality: any;
  selectedHomeBarangay: any;
  selectedGender = '';
  selectedStatus = '';
  isSameAddress = false;
  home_zip_code: string = ''
  work_zip_code: string = ''
  loading: boolean = false;
  showValidationMessages = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  

  constructor(
    private createAccountService: AccountService,
    private personService: PersonService,
    private locationService: LocationService,
    private router: Router,
    private citizenService: CitizenService
  ) {
    this.dateOfBirth = new Date().toISOString().substring(0, 10);
  
  }

  ngOnInit(): void {
    this.createAccountService;
    this.locationService.getRegions().subscribe((data) => {
      this.regions = data;
      this.userHomeAddress.region = 'Region VII'; 
      this.onHomeRegionChange({ detail: { value: 'Region VII' } });
      this.userHomeAddress.province = 'City of Cebu'; // Default province
      this.onHomeProvinceChange({ detail: { value: 'City of Cebu' } });
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }


  updateGender() {
    this.upgraded.sex = this.selectedGender;
  }

  updateBirthdate() {
    this.upgraded.birthdate = this.dateOfBirth;
  }
  

  onAddressCheckboxChange(event: any) {
    this.isSameAddress = event.detail.checked;

    if (this.isSameAddress && typeof this.copyHomeToWorkAddress === 'function') {
      this.copyHomeToWorkAddress();
      console.log(this.copyHomeToWorkAddress)
  } else if (typeof this.resetWorkAddress === 'function') {
      this.resetWorkAddress();
      console.log(this.resetWorkAddress)
  }
  
}

copyHomeToWorkAddress() {
  
  this.userWorkAddress.region = this.userHomeAddress.region;
  this.userWorkAddress.province = this.userHomeAddress.province;
  this.userWorkAddress.municipality = this.userHomeAddress.municipality;
  this.userWorkAddress.barangay = this.userHomeAddress.barangay;
  this.userWorkAddress.street = '';
  this.userWorkAddress.block = '';
  this.userWorkAddress.zipCode = 0;


}
  resetWorkAddress() {
    this.userWorkAddress.region = '';
    this.userWorkAddress.province = '';
    this.userWorkAddress.municipality = '';
    this.userWorkAddress.barangay = '';
    this.userWorkAddress.street = '';
    this.userWorkAddress.zipCode = 0;
  }

  onHomeAddressChange() {
    if (this.isSameAddress) {
      this.copyHomeToWorkAddress();
    }
  }

  
 
  async register() {
    this.showValidationMessages = true;

    if (!this.upgraded.firstname ||
        !this.upgraded.middlename ||
        !this.upgraded.lastname || 
        !this.upgraded.birthdate ||
        !this.upgraded.sex ||
        !this.upgraded.civilStatus ||    
        !this.upgraded.email || 
        !this.upgraded.password || 
        !this.confirmPassword || 
        !this.upgraded.contactNum) {
        console.error('Please fill out all required fields');
        return;
    }

    if (!this.isValidEmail(this.upgraded.email)) {
        console.error('Invalid email address');
        return;
    }

    if (this.upgraded.password.length < 8) {
        console.error('Password must be at least 8 characters');
        return;
    }

    if (this.confirmPassword !== this.upgraded.password) {
        console.error('Passwords do not match');
        return;
    }

    if (!this.upgraded.contactNum.startsWith('09')) {
        console.error('Contact number must start with 09');
        return;
    }

    // Prepare address data
    this.userHomeAddress.zipCode = Number(this.home_zip_code);
    this.userWorkAddress.zipCode = Number(this.work_zip_code);
    this.personData.birthdate = this.dateOfBirth;

    this.convertLocationIdsToNames(
        this.userHomeAddress,
        this.homeProvinces,
        this.homeMunicipalities,
        this.homeBarangays
    );

    if (this.isSameAddress) {
        this.userWorkAddress = {
            locationId: 0,
            region: this.userHomeAddress.region,
            province: this.userHomeAddress.province,
            municipality: this.userHomeAddress.municipality,
            barangay: this.userHomeAddress.barangay,
            street: '',
            zipCode: 0,
        };
    } else {
        this.convertLocationIdsToNames(
            this.userWorkAddress,
            this.workProvinces,
            this.workMunicipalities,
            this.workBarangays
        );
    }

    this.loading = true; // Show loading indicator

    try {
        const homeAddressPromise = this.locationService
            .createOrRetrieveLocation(this.userHomeAddress, this.userHomeAddress.zipCode)
            .toPromise()
            .then((homeResponse) => {
                if (homeResponse.locationFound) {
                    this.upgraded.homeAddressId = homeResponse.locationId;
                    console.log('Home address exists with ID:', homeResponse.locationId);
                    this.loading = false;
                } else {
                    this.upgraded.homeAddressId = homeResponse.locationId;
                    console.log('New home address created with ID:', homeResponse.locationId);
                }
            });

        const workAddressPromise = !this.isSameAddress
            ? this.locationService
                .createOrRetrieveLocation(this.userWorkAddress, this.userWorkAddress.zipCode)
                .toPromise()
                .then((workResponse) => {
                    if (workResponse.locationFound) {
                        this.upgraded.workAddressId = workResponse.locationId;
                        console.log('Work address exists with ID:', workResponse.locationId);
                        this.loading = false;
                    } else {
                        this.upgraded.workAddressId = workResponse.locationId;
                        console.log('New work address created with ID:', workResponse.locationId);
                    }
                })
            : Promise.resolve();

        if (!this.termsAccepted) {
            console.error('You must accept the terms and conditions');
            return;
        }

        await Promise.all([homeAddressPromise, workAddressPromise]);

        const formDataUpgraded = new FormData();
        formDataUpgraded.append('Firstname', this.upgraded.firstname);
        formDataUpgraded.append('Middlename', this.upgraded.middlename);
        formDataUpgraded.append('Lastname', this.upgraded.lastname);
        formDataUpgraded.append('Password', this.upgraded.password);
        formDataUpgraded.append('Sex', this.upgraded.sex);
        formDataUpgraded.append('Birthdate', this.upgraded.birthdate);
        formDataUpgraded.append('CivilStatus', this.upgraded.civilStatus || '');
        formDataUpgraded.append('BioStatus', this.upgraded.bioStatus.toString());
        formDataUpgraded.append('Email', this.upgraded.email);
        formDataUpgraded.append('TelNum', this.upgraded.telNum?.toString() || '');
        formDataUpgraded.append('ContactNum', this.upgraded.contactNum);
        formDataUpgraded.append('HomeAddressId', this.upgraded.homeAddressId ? this.upgraded.homeAddressId.toString() : '');
        formDataUpgraded.append('WorkAddressId', this.upgraded.workAddressId ? this.upgraded.workAddressId.toString() : '');
        formDataUpgraded.append('Role', this.upgraded.role);

        console.log('Final Home Address ID:', this.upgraded.homeAddressId);
        console.log('Final Work Address ID:', this.upgraded.workAddressId);

        const response = await this.createAccountService.upgradeAccount(formDataUpgraded).toPromise();
        alert('Registration successful');
     
        this.citizenData.personId = this.upgraded.personId || 0;
        this.router.navigate(['/login']);

        if (response) {
            sessionStorage.setItem('userData', JSON.stringify(response));
            console.log('UserData stored in sessionStorage:', sessionStorage.getItem('userData'));
        } else {
            console.error('Response is undefined or null');
        }
    } catch (error: any) {
        if (error.status === 0) {
            alert('Network error: Unable to reach the server. Please check your connection.');
            console.log('Error Status:', error.status);
        } else {
            alert(`Error Code: ${error.status}\nMessage: ${error.message}`);
            console.log('Error Message:', error);
        }
      
    } finally {
      console.log('Hiding loading indicator'); // Debugging log
        this.loading = false; // Hide loading indicator
    }
}
  

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

 
onHomeRegionChange(event: any) {
  const regionId = event.detail.value;
  const selectedRegion = this.regions.find((r) => r.region_id === regionId);
  this.locationService.getProvinces().subscribe((data) => {
      this.homeProvinces = data.filter((p) => p.region_id === regionId);
      this.homeMunicipalities = []; 
      this.homeBarangays = [];
      if (this.userHomeAddress.province) {
        this.onHomeProvinceChange({ detail: { value: this.userHomeAddress.province } });
    }
  });
}


onHomeProvinceChange(event: any) {
  const provinceId = event.detail.value;
  const selectedProvince = this.homeProvinces.find((p) => p.province_id === provinceId);
  this.locationService.getMunicipalities().subscribe((data) => {
      this.homeMunicipalities = data.filter((m) => m.province_id === provinceId);
      this.homeBarangays = [];
  });
}

onHomeMunicipalityChange(event: any) {
  const municipalityId = event.detail.value;
  const selectedMunicipality = this.homeMunicipalities.find((m) => m.municipality_id === municipalityId);
  this.locationService.getBarangays().subscribe((data) => {
      this.homeBarangays = data.filter((b) => b.municipality_id === municipalityId);
  });
}


onWorkRegionChange(event: any) {
  const regionId = event.detail.value;
  const selectedRegion = this.regions.find((r) => r.region_id === regionId);
  this.locationService.getProvinces().subscribe((data) => {
      this.workProvinces = data.filter((p) => p.region_id === regionId);
      this.workMunicipalities = []; 
      this.workBarangays = [];
  });
}


onWorkProvinceChange(event: any) {
  const provinceId = event.detail.value;
  const selectedProvince = this.workProvinces.find((p) => p.province_id === provinceId);
  this.locationService.getMunicipalities().subscribe((data) => {
      this.workMunicipalities = data.filter((m) => m.province_id === provinceId);
      this.workBarangays = []; 
  });
}


onWorkMunicipalityChange(event: any) {
  const municipalityId = event.detail.value;
  const selectedMunicipality = this.workMunicipalities.find((m) => m.municipality_id === municipalityId);
  this.locationService.getBarangays().subscribe((data) => {
      this.workBarangays = data.filter((b) => b.municipality_id === municipalityId);
  });
}

  convertLocationIdsToNames(location: Location, provinces: any[], municipalities: any[], barangays: any[]) {
    const selectedRegion = this.regions.find(
      (r) => r.region_id === location.region
    );
    const selectedProvince = provinces.find(
      (p) => p.province_id === location.province
    );
    const selectedMunicipality = municipalities.find(
      (m) => m.municipality_id === location.municipality
    );
    const selectedBarangay = barangays.find(
      (b) => b.barangay_id === location.barangay
    );

    location.region = selectedRegion ? selectedRegion.region_name : '';
    location.province = selectedProvince ? selectedProvince.province_name : '';
    location.municipality = selectedMunicipality
      ? selectedMunicipality.municipality_name
      : '';
    location.barangay = selectedBarangay ? selectedBarangay.barangay_name : '';
  }


}
