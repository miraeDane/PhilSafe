import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Person } from 'src/app/models/person';
import { Location } from 'src/app/models/location';
import { CreateAccountData } from 'src/app/models/create-account-data';
import { Occupation } from 'src/app/models/occupation';
import { LocationService } from 'src/app/services/location.service';
import { Description, Nationalities } from 'src/app/models/description';
import { DescriptionService } from 'src/app/services/description.service';
import { MediumService } from 'src/app/services/medium.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  person: Person = {
    personId: 0,
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
    role: 'user',
    personId: 0,
  };

  occupation: Occupation = {
    occupationId: 0,
    name: '',

  }

  description: Description = {
    descriptionId: 0,
    ethnicity: ''
  }
  
  home_zip_code: string = '';
  work_zip_code: string = '';
  officenum: string = ''
  isEditing: boolean = false; 
  regions: any[] = [];
  nationalities: Nationalities = [];
  selectedNationality: string = '';

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
   avatarUrl: string = 'assets/user-default.jpg';
   selectedFile!: File;
   isSameAddress = false;

   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  constructor(
    private locationService: LocationService,
    private nationalityService: DescriptionService,
    private mediumService: MediumService,
  ) { }

  ngOnInit() {

    this.loadNationalities();
    this.locationService.getRegions().subscribe((data) => {
      this.regions = data;
    });
  }

  loadNationalities() {
    this.nationalityService.getNationalities().subscribe(
      (data: Nationalities) => {
        this.nationalities = data; 

      },
      (error) => {
        console.error('Error fetching nationalities:', error);
      }
    );
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file; 
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = e.target?.result as string; 
      };
      reader.readAsDataURL(file); 

      this.uploadAvatar(file);
    }
  }
  uploadAvatar(file: File) {
    this.mediumService.uploadItem(file).subscribe(
      (response) => {
        console.log('File uploaded successfully:', response);
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  edit() {
    this.isEditing = true;
    const inputs = document.querySelectorAll('ion-input');
    inputs.forEach((input) => {
      (input as HTMLIonInputElement).disabled = false;
    });

    const selects = document.querySelectorAll('ion-select');
    selects.forEach((select) => {
      (select as HTMLIonSelectElement).disabled = false; 
    });
  }

  save() {

    this.description.ethnicity = this.selectedNationality;
    this.userHomeAddress.zipCode = Number(this.home_zip_code);
    this.userWorkAddress.zipCode = Number(this.work_zip_code);
    console.log(this.description.ethnicity);
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
 
    const inputs = document.querySelectorAll('ion-input');
    inputs.forEach((input) => {
      (input as HTMLIonInputElement).disabled = true; 
    });

    const selects = document.querySelectorAll('ion-select');
    selects.forEach((select) => {
      (select as HTMLIonSelectElement).disabled = true; 
    });

    
    console.log('Profile saved!'); 

    this.isEditing = false; 
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
