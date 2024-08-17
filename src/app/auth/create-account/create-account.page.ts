import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CreateAccountData } from 'src/app/models/create-account-data';
import { Person } from 'src/app/models/person';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { PersonService } from 'src/app/services/person.service';
import { UpgradeAccount } from 'src/app/models/account-upgrade.model';

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
    role: 'user',

  }

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
  zip_code: string = ''

  constructor(
    private createAccountService: AccountService,
    private personService: PersonService,
    private locationService: LocationService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    this.dateOfBirth = new Date().toISOString().substring(0, 10);
    // this.upgraded.birthdate = this.dateOfBirth;
  }

  ngOnInit(): void {
    this.createAccountService;
    this.locationService.getRegions().subscribe((data) => {
      this.regions = data;
    });
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

  register() {

    this.userHomeAddress.zipCode = Number(this.zip_code);
    this.userWorkAddress.zipCode = Number(this.zip_code);
    this.personData.birthdate = this.dateOfBirth;
    
    this.convertLocationIdsToNames(
      this.userHomeAddress,
      this.homeProvinces,
      this.homeMunicipalities,
      this.homeBarangays
    );
    this.userHomeAddress.zipCode = Number(this.userHomeAddress.zipCode);

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
      this.userWorkAddress.zipCode = Number(this.userWorkAddress.zipCode);
    }

    console.log(this.userHomeAddress);
    console.log(this.userWorkAddress);
    // console.log(this.personData);

    // this.personService
    //   .createOrRetrievePerson(this.personData)
    //   .subscribe((response) => {
    //     if (response.personFound) {
    //       const personId = response.personId;
    //       this.accountData.personId = personId;
    //       console.log('Person exists with ID:', personId);
    //     } else {
    //       const newPersonId = response.personId;
    //       console.log('New person created with ID:', newPersonId);
    //       this.accountData.personId = newPersonId;
    //     }
    //   });

    this.locationService
      .createOrRetrieveLocation(
        this.userHomeAddress,
        this.userHomeAddress.zipCode
      )
      .subscribe((homeResponse) => {
        if (homeResponse.locationFound) {
          const homeLocationId = homeResponse.locationId;
          this.upgraded.homeAddressId = homeLocationId;
          this.upgraded.workAddressId = homeLocationId
          console.log('Home address exists with ID:', homeLocationId);
        } else {
          const newHomeLocationId = homeResponse.locationId;
          console.log('New home address created with ID:', newHomeLocationId);
          this.upgraded.homeAddressId = newHomeLocationId
        }

        if (!this.isSameAddress) {
          this.locationService
            .createOrRetrieveLocation(
              this.userWorkAddress,
              this.userWorkAddress.zipCode
            )
            .subscribe((workResponse) => {
              if (workResponse.locationFound) {
                const workLocationId = workResponse.locationId;
                this.upgraded.workAddressId = workLocationId;
                console.log('Work address exists with ID:', workLocationId);
              } else {
                const newWorkLocationId = workResponse.locationId;
                this.upgraded.workAddressId = newWorkLocationId;
                console.log(
                  'New work address created with ID:',
                  newWorkLocationId
                );
              }
            });
        }
      });

      if (!this.termsAccepted) {
        console.error('You must accept the terms and conditions');
        return;
      }
      // if (this.accountData.password !== this.confirmPassword) {
      //   console.error('Passwords do not match');
      //   return;
      // }
      // if (this.accountData.password.length < 8) {
      //   console.error('Password must be at least 8 characters long');
      //   return;
      // }
  
      // this.createAccountService.postAccount(this.accountData).subscribe(
      //   (response) => {
      //     alert('Registration successful');
      //     console.log(this.accountData);
      //     this.router.navigate(['/tabs/home']);
      //   },
      //   (error) => {
      //     console.error('Failed to register account', error);
      //     console.log(this.accountData);
  
  
      //   });

        this.createAccountService.upgradeAccount(this.upgraded).subscribe(
          (response) => {
            alert('Registration successful');
            console.log(this.upgraded);
            this.router.navigate(['/tabs/home']);
          },
          (error) => {
            console.error('Failed to register account', error);
            console.log(this.upgraded);

            if (error.status === 500) {
              alert(`An internal server error occurred while trying to register your account. This may be due to a problem with the server or an issue with the data being sent. Please try again later, or contact support if the problem persists.
        
        Details:
        Error Code: ${error.status}
        Message: ${error.message}
        
        Data Sent: ${JSON.stringify(this.upgraded)}
        
        This error might be caused by one of the following:
        - The server encountered an unexpected condition that prevented it from fulfilling the request.
        - There could be a mismatch between the expected data format and the data being sent.
        - Some required fields might be missing or incorrect in the request payload.
        - There might be a problem with the server's database connection or a related service.
        
        Please review the data being sent and ensure all required fields are filled out correctly. If the issue persists, provide the above information to the support team for further assistance.`);
            } else {
              alert(`An error occurred: ${error.message}`);
            }
    
    
          });

    // console.log(this.accountData); 
    // this.router.navigate(['/account-registration'], { state: { accountData: this.accountData } });
  }

 
onHomeRegionChange(event: any) {
  const regionId = event.detail.value;
  const selectedRegion = this.regions.find((r) => r.region_id === regionId);
  this.locationService.getProvinces().subscribe((data) => {
      this.homeProvinces = data.filter((p) => p.region_id === regionId);
      this.homeMunicipalities = []; 
      this.homeBarangays = [];
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
