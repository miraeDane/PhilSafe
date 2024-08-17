import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { IonicModule } from '@ionic/angular';
import { SignatureModalComponent } from '../signature-modal/signature-modal.component';
import { Person } from 'src/app/models/person';
import { Location } from 'src/app/models/location';
import { CreateAccountData } from 'src/app/models/create-account-data';
import { Occupation } from 'src/app/models/occupation';
import { LocationService } from 'src/app/services/location.service';
import { Description, Nationalities } from 'src/app/models/description';

import { DescriptionService } from 'src/app/services/description.service';
import { MediumService } from 'src/app/services/medium.service';
import { Suspect } from '../models/suspect';
import { BasePerson } from '../models/0common.model';
import { Complainant } from '../models/1complainant.model';
import { SuspectCommon } from '../models/2suspect.model';
import { VictimCommon } from '../models/3victim.model';
import { CreateAccountPage } from '../auth/create-account/create-account.page';
import { Medium } from '../models/medium';
import { idLists } from 'src/assets/id-lists';
import { Report } from '../models/report';
import { AddSuspectPage } from './add-suspect/add-suspect.page';
import { CrimeService } from '../services/crime.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  @ViewChild('datePicker', { static: false }) datePicker: any;
  @ViewChild('canvas', { static: true }) signaturePadElement: any;

  complainant: Complainant = {
    personId: 0,
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
    description: {descriptionId: 0, ethnicity: ''},
    contactDetails: { email: '', homePhone: '', mobileNum: '', telNum: '' },
    homeAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0 },
    workAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', zipCode: 0 },
    occupation: { occupationId: 0, name: '' },
  };

  suspect: SuspectCommon = {
    personId: 0,
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
    contactDetails: { email: '', homePhone: '', mobileNum: '' },
    homeAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', zipCode: 0 },
    workAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '',block:'', zipCode: 0 },
    description: { descriptionId: 0, ethnicity: '', height: 0, weight: 0, eyeColor: '', hairColor: '', drug: false, alcohol: false, distinguishingMark:'' },
    occupation: { occupationId: 0, name: '' },
    isUnidentified: false, 
  };

  victim: VictimCommon = {
    personId: 0,
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
    description: {descriptionId: 0, ethnicity: ''},
    contactDetails: { email: '', homePhone: '', mobileNum: '' },
    homeAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '',block:'', zipCode: 0 },
    workAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0 },
    occupation: { occupationId: 0, name: '' },
  };

  idData: Medium = {
    mediaId:  0,
    content: new Uint8Array(),
    contentType: '',
    description: '',
    filename: ''
  }

  complainantData: CreateAccountData = {
    
    email: '',
    password: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId: 0,
    personId: 0,
    role: '',
  }

  complainantLoc: Location = {
    locationId: 0,
    province: '',
    municipality: '',
    street: '',
    region: '',
    barangay: '',
    zipCode: 0,
  }

  suspectData: CreateAccountData = {
  
    email: '',
    password: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId: 0,
    personId: 0,
    role: 'Uncertified',
  }

  reportData: Report = {
    reportId: 0,
    reportBody: '',
    citizenId: 0,
    stationId: 0,
    reportSubCategoryId: 0,
    reportedDate: '',
    blotterNum: '',
    eSignature: new Uint8Array,
    signatureExt: '',
    hasAccount: true,
    media: [{
      mediaId:  0,
      content: new Uint8Array(),
      contentType: '',
      description: '',
      filename: ''
    }]

  }

  isSamePerson: boolean = false;
  height: string = '';
  weight: string = '';

  comp_home_zip_code: string = '';
  comp_work_zip_code: string = '';
  sus_home_zip_code: string = '';
  sus_work_zip_code: string = '';
  vic_home_zip_code: string = '';
  vic_work_zip_code: string = '';

  officenum: string = ''
  isEditing: boolean = false; 
  regions: any[] = [];
  nationalities: Nationalities = [];
  complainantNationality: string = '';
  suspectNationality: string = '';
  victimtNationality: string = '';
  

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
   selectedFile!: File;
   isSameAddress = false;

  selectedSegment: any = 1;
  currentSegment: number = 2;
  dateOfBirth: string = '';
  signaturePad!: SignaturePad;
  signatureData: string = '';
  fileName: string = '';
  idOptions = idLists;
  suspects: SuspectCommon[] = [];

  indexCrimes: any[] = [];
  nonIndexCrimes: any[] = [];
  selectedCrime: string = '';
  isIndexCrime: boolean = false;

  
  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private locationService: LocationService,
    private nationalityService: DescriptionService,
    private mediumService: MediumService,
    private router: Router,
    private crimeService: CrimeService,
    
  ) {
    this.dateOfBirth = new Date().toISOString().substring(0, 10);
   }

  ngOnInit() {
    this.loadNationalities();
    this.route.paramMap.subscribe(params => {
      const segment = params.get('segment');
      this.selectedSegment = segment ? segment : 1;
    });
    this.locationService.getRegions().subscribe((data) => {
      this.regions = data;
    });

    this.loadCrimes();
  }

  /**************************************************************************************************/
  /***************************************LOCATION**************************************************/
  /*************************************************************************************************/

  onAddressCheckboxChange(event: any, type: 'complainant' | 'suspect' | 'victim') {
    this.isSameAddress = event.detail.checked;

    if (this.isSameAddress) {
      if (type === 'complainant') {
        this.copyAddress(this.complainant.homeAddress, this.complainant.workAddress);
      } else if (type === 'suspect') {
        this.copyAddress(this.suspect.homeAddress, this.suspect.workAddress);
      } else if (type === 'victim') {
        this.copyAddress(this.victim.homeAddress, this.victim.workAddress);
      }
    } else {
      if (type === 'complainant') {
        this.resetAddress(this.complainant.workAddress);
      } else if (type === 'suspect') {
        this.resetAddress(this.suspect.workAddress);
      } else if (type === 'victim') {
        this.resetAddress(this.victim.workAddress);
      }
    }
  }

  copyAddress(source: Location, target: Location) {
    target.region = source.region;
    target.province = source.province;
    target.municipality = source.municipality;
    target.barangay = source.barangay;
    target.street = '';
    target.block = '';
    target.zipCode = 0;
  }

  resetAddress(address: Location) {
    address.region = '';
    address.province = '';
    address.municipality = '';
    address.barangay = '';
    address.street = '';
    address.zipCode = 0;
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

    getUserLocation(): Promise<{ latitude: number; longitude: number }> {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    }
  
    async getStationId(latitude: number, longitude: number): Promise<number> {
  
      return 1;
    }
  



  /**************************************************************************************************/
  /*****************************************PERSON**************************************************/
  /**************************************************************************************************/

  addSuspect(newSuspect: SuspectCommon) {
    this.suspects.push(newSuspect);
  }

  async navigateToAddSuspect() {
    const modal = await this.modalController.create({
      component: AddSuspectPage, 
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.addSuspect(result.data); 
      }
    });

    return await modal.present();
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
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.fileName = this.selectedFile.name; 
      console.log('Selected file:', this.selectedFile);
      this.setRoleBasedOnUpload(true); 
    } else {
      this.setRoleBasedOnUpload(false); 
    }
  }

  setRoleBasedOnUpload(isUploaded: boolean) {
    this.complainantData.role = isUploaded ? 'Certified' : 'Uncertified';
  }


  isUnderInfluence(): boolean {
    return (this.suspect.description?.drug ?? false) || (this.suspect.description?.alcohol ?? false);
  }

  checkIfSamePerson() {
    this.isSamePerson = this.complainant.firstname === this.victim.firstname &&
                       this.complainant.lastname === this.victim.lastname;
  }

  async openSignatureModal() {
    const modal = await this.modalController.create({
      component: SignatureModalComponent,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Signature Data:', data.signature);
     
    }
  }








  /**************************************************************************************************/
  /****************************************SEGMENT***************************************************/
  /**************************************************************************************************/

  segmentChanged(event: any) {
    console.log('Segment changed', event.detail.value);
    const segmentValue = event.detail.value; 
    this.selectedSegment = segmentValue; 
    this.router.navigate(['/report', segmentValue]);
  }

  goToNextSegment(segment: any) {
    segment = (parseInt(this.selectedSegment, 10) + 1).toString();
    this.selectedSegment = segment;
  }

  proceedToNextSegment() {
    
    // this.selectedSegment = 2;
    setTimeout(() => {
      this.goToNextSegment(this.selectedSegment); 
    }, 2000);
      console.log('Proceeding to the next segment...');
      
      
    }
  
  




   /**************************************************************************************************/
  /******************************************DATE****************************************************/
  /**************************************************************************************************/

  getCurrentDate(): string {
    const now = new Date();
    return now.toISOString();
  }  

  openDatePicker() {
    this.datePicker.open();
  }

  

  dateChanged(event:any) {
    this.dateOfBirth = event.detail.value;
  }






  /**************************************************************************************************/
  /*****************************************REPORT***************************************************/
  /**************************************************************************************************/

  async initializeReportData() {
    try {
      const location = await this.getUserLocation();
      this.reportData.stationId = await this.getStationId(location.latitude, location.longitude);
      this.reportData.reportedDate = this.getCurrentDate();
    } catch (error) {
      console.error('Error getting location or station ID:', error);
    }
  }



  /**************************************************************************************************/
  /**************************************CRIME-LISTS*************************************************/
  /**************************************************************************************************/

  loadCrimes() {
    this.crimeService.getIndexCrimes().subscribe(data => {
      this.indexCrimes = data;
    });

    this.crimeService.getNonIndexCrimes().subscribe(data => {
      this.nonIndexCrimes = data;
    });
  }

  onCrimeChange(event: any) {
    this.selectedCrime = event.detail.value;
    this.isIndexCrime = this.indexCrimes.some(crime => crime.crime_name === this.selectedCrime);
  }

  
  /**************************************************************************************************/
  /****************************************SERVICE***************************************************/
  /**************************************************************************************************/


save(){
  console.log(this.complainant);
  console.log(this.selectedCrime);
  console.log(this.reportData.media);
  console.log(this.suspect);

}
  




}
