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
import { SuspectCommon } from '../models/2suspect.model';
import { VictimCommon } from '../models/3victim.model';
import { Medium } from '../models/medium';
import { idLists } from 'src/assets/id-lists';
import { Report } from '../models/report';
import { AddSuspectPage } from './add-suspect/add-suspect.page';
import { CrimeService } from '../services/crime.service';
import { Complainant } from '../models/1witness.model';
import { WitnessService } from '../services/witness.service';
import { SuspectService } from '../services/suspect.service';
import { VictimService } from '../services/victim.service';
import { PersonService } from '../services/person.service';
import { switchMap, concatMap, of, EMPTY, tap, catchError, forkJoin, map  } from 'rxjs';
import { Victim } from '../models/victim';
import { OccupationService } from '../services/occupation.service';
import { ReportService } from '../services/report.service';
import { IncidentType } from '../models/incident-type';
import { CitizenService } from '../services/citizen.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Citizen } from '../models/citizen';



@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  @ViewChild('datePicker', { static: false }) datePicker: any;
  @ViewChild('canvas', { static: true }) signaturePadElement: any;

  witness: Complainant = {
    personId: 0,
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    bioStatus: true,
    //contactDetails: { email: '',  mobileNum: '', telNum: '' },
    homeAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0 },
    workAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', zipCode: 0 }
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
    //contactDetails: { email: '',  mobileNum: '' },
    homeAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', zipCode: 0 },
    workAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '',block:'', zipCode: 0 },
    description: { descriptionId: 0, ethnicity: '', height: 0, weight: 0, eyeColor: '', hairColor: '', drug: false, alcohol: false, distinguishingMark:'', personId: 0
     },
    isUnidentified: false, 
    suspect: {suspectId: 0, personId: 0, isCaught: false}
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
    // description: {descriptionId: 0, ethnicity: '', personId: 0},
    //contactDetails: { email: '',  mobileNum: '' },
    homeAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '',block:'', zipCode: 0 },
    workAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0 },
    victim: {victimId: 0, vicMethodId: 0, personId: 0, vicMethod: {
      vicMethodId: 0, methodName: ''
    }}
  };

  idData: Medium = {
    file: null,
    mediaId:  0,
    content: new Uint8Array(),
    contentType: '',
    description: '',
    filename: null as File | null
  }

  idDetails: Citizen = {
    citizenId: 0,
    personId: 0,
    citizenProof: new Uint8Array,
    proofExt: ''
  }

  witnessData: CreateAccountData = {
    
    email: '',
    password: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId: 0,
    personId: 0,
    role: '',
  }

  witnessLoc: Location = {
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
    stationId: 1,
    incidentDate: '',
    reportSubCategoryId: 0,
    blotterNum: '07601-0662456',
    eSignature: new Uint8Array,
    signatureExt: '',
    hasAccount: true,
    locationId: 0,
    reportSubCategory: {
      reportSubCategoryId: 0,
      reportCategoryId: 0,
      subCategoryName:''
    }
  }

  incidentPlace: Location ={
    locationId: 0,
    province: '',
    municipality: '',
    street: '',
    region: '',
    barangay: '',
    zipCode: 0,
  }


  isSamePerson: boolean = false;
  height: string = '';
  weight: string = '';

  // comp_home_zip_code: string = '';
  // comp_work_zip_code: string = '';
  // sus_home_zip_code: string = '';
  // sus_work_zip_code: string = '';
  // vic_home_zip_code: string = '';
  // vic_work_zip_code: string = '';
  // inc_zip_code: string = '';


  comp_home_zip_code: any;
  comp_work_zip_code: any;
  sus_home_zip_code: string = '';
  sus_work_zip_code: string = '';
  vic_home_zip_code: any;
  vic_work_zip_code: any;
  inc_zip_code: string = '';

  sus_height: string = '';
  sus_weight: string = '';

  officenum: string = ''
  isEditing: boolean = false; 
  regions: any[] = [];
  nationalities: Nationalities = [];
  witnessNationality: string = '';
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
  selectedCrime: number = 0;
  isIndexCrime: boolean = false;
  isDataLoaded: boolean = false;
  isVictimDataLoaded: boolean = false;
  isWitnessDataLoaded: boolean = false;
  selectedReporterType: string = '';
  
  userData: any;
  reporterType: string = '';
  incidentDate: string = '';
  reportedDate: string = this.getCurrentDate();
  modus: any[] = [];
  selectedmodus: any = null;
  isExpanded: boolean = false;
  selectedIncidentID: number = 0;
  incidentTypes: IncidentType[] = [];
  incidentTypeMap: { [key: number]: string } = {};
  latitude: number | null = null;
  longitude: number | null = null;
  locationError: string = '';
  locationName: string = 'Your current location is unknown.';
  stationName: string = 'Unknown Station';
  solvedCrimesCount: number = 0;
  totalSolvedCrimesCount: number = 0;
  solvedCrimesPerStation: number = 0;
  policeStations: any[] = [];
  isLoadingLocation: boolean = true; 
  isLoadingCrimes: boolean = true; 
  loadingMessage: string = '';
  loading: boolean = false;
  isModalOpen: boolean = false;
  isSameAddressSuspect: boolean = false;
  isSameAddressVictim: boolean = false;
  isSameAddressWitness: boolean = false;
  showValidationMessages = false;
  signHere: string = '';
  witnessDateOfBirth: string = '';
  suspectDateOfBirth: string = '';
  victimDateOfBirth: string = '';




  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private locationService: LocationService,
    private nationalityService: DescriptionService,
    private descriptionService: DescriptionService,
    private mediumService: MediumService,
    private router: Router,
    private crimeService: CrimeService,
    private witnessService: WitnessService,
    private suspectService: SuspectService,
    private victimService: VictimService,
    private personService: PersonService,
    private occupationService: OccupationService,
    private reportService: ReportService,
    private citizenService: CitizenService,
    private http: HttpClient
    
  ) {
    this.witnessDateOfBirth = new Date().toISOString().substring(0, 10);
    this.suspectDateOfBirth = new Date().toISOString().substring(0, 10);
    this.victimDateOfBirth = new Date().toISOString().substring(0, 10);
    this.incidentDate = new Date().toISOString().substring(0, 10);
    this.reportedDate = new Date().toISOString().substring(0, 10);
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
    this.loadModus();

    this.route.queryParams.subscribe(params => {
      this.selectedReporterType = params['reporterType'];
    });

    this.route.queryParams.subscribe(params => {
      this.reporterType = params['reporterType'];
      console.log('Reporter Type:', this.reporterType);

      if (this.reporterType === 'victim') {
        this.selectedSegment = '2'; 
      } else {
        this.selectedSegment = '1'; 
      }
    });
    this.loadIncidentTypes();

    const userData = sessionStorage.getItem('userData');
    if (userData) {
        const { personId } = JSON.parse(userData);
        this.citizenService.getCitizens().subscribe(
            (citizens) => {
                const citizen = citizens.find((c: { person_id: any; }) => c.person_id === personId); 
                if (citizen) {
                    this.reportData.citizenId = citizen.citizen_id; 
                    console.log('Retrieved citizenId:', citizen.citizen_id);
                    console.log('Retrieved citizens', citizens)
                } else {
                    console.error('Citizen not found for personId:', personId);
                    console.log('Retrieved citizens', citizens)
                }
            },
            error => {
                console.error('Error retrieving citizens:', error);
            }
        );
    }

    this.getCurrentLocation().then(() => {
      this.loadPoliceStations().then(() => {
      });
  });

  // if (!this.reportData.location) {
  //   this.reportData.location = {
  //     region: '',
  //     province: '',
  //     municipality: '',
  //     barangay: '',
  //     street: '',
  //     block: '',
  //     zipCode: 0
  //   }; 
  // }


 
  }


  /**************************************************************************************************/
  /***************************************LOCATION**************************************************/
  /*************************************************************************************************/

  onAddressCheckboxChange(event: any, type: 'witness' | 'suspect' | 'victim') {
    if (type === 'witness') {
      this.isSameAddressWitness = event.detail.checked;
      if (this.isSameAddressWitness) {
        this.copyAddress(this.witness.homeAddress, this.witness.workAddress);
        console.log('witness work address:', this.witness.workAddress)
      } else {
        this.resetAddress(this.witness.workAddress);
      }
    } else if (type === 'suspect') {
      this.isSameAddressSuspect = event.detail.checked;
      if (this.isSameAddressSuspect) {
        this.copyAddress(this.suspect.homeAddress, this.suspect.workAddress);
      } else {
        this.resetAddress(this.suspect.workAddress);
      }
    } else if (type === 'victim') {
      this.isSameAddressVictim = event.detail.checked;
      if (this.isSameAddressVictim) {
        this.copyAddress(this.victim.homeAddress, this.victim.workAddress);
      } else {
        this.resetAddress(this.victim.workAddress);
      }
    }
  }
  
  copyAddress(source: Location, target: Location) {
    target.region = source.region;
    target.province = source.province;
    target.municipality = source.municipality;
    target.barangay = source.barangay;
    target.street = source.street; 
    target.block = source.block;   
    target.zipCode = source.zipCode;  
  
    
   
      this.convertLocationIdsToNames(
        target,
        this.homeProvinces,
        this.homeMunicipalities,
        this.homeBarangays
      );
   
    
  
    // Log the copied values to the console
    console.log(`Address copied:`);
    console.log(`Region: ${target.region}`);
    console.log(`Province: ${target.province}`);
    console.log(`Municipality: ${target.municipality}`);
    console.log(`Barangay: ${target.barangay}`);
  }
  
  resetAddress(address: Location) {
    address.region = '';
    address.province = '';
    address.municipality = '';
    address.barangay = '';
    address.street = '';
    address.block = '';
    address.zipCode = 0;
  }
  
  // Convert location IDs to names using selected arrays (provinces, municipalities, barangays)
  convertLocationIdsToNames(location: Location, provinces: any[], municipalities: any[], barangays: any[]) {
    const selectedRegion = this.regions.find((r) => r.region_id === location.region);
    const selectedProvince = provinces.find((p) => p.province_id === location.province);
    const selectedMunicipality = municipalities.find((m) => m.municipality_id === location.municipality);
    const selectedBarangay = barangays.find((b) => b.barangay_id === location.barangay);
  
    location.region = selectedRegion ? selectedRegion.region_name : '';
    location.province = selectedProvince ? selectedProvince.province_name : '';
    location.municipality = selectedMunicipality ? selectedMunicipality.municipality_name : '';
    location.barangay = selectedBarangay ? selectedBarangay.barangay_name : '';
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


  getRegionName(regionId: string): string {
    const region = this.regions.find(r => r.region_id === regionId);
    return region ? region.region_name : '';
  }
  
  getProvinceName(provinceId: string): string {
    const province = this.homeProvinces.find(p => p.province_id === provinceId);
    return province ? province.province_name : '';
  }
  
  getMunicipalityName(municipalityId: string): string {
    const municipality = this.homeMunicipalities.find(m => m.municipality_id === municipalityId);
    return municipality ? municipality.municipality_name : '';
  }
  
  getBarangayName(barangayId: string): string {
    const barangay = this.homeBarangays.find(b => b.barangay_id === barangayId);
    return barangay ? barangay.barangay_name : '';
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

  onSuspectIdentificationChange() {
    if (this.suspect.isUnidentified) {
      // Clear personal information and address fields
      this.clearSuspectPersonalInfo();
    }
  }

  clearSuspectPersonalInfo() {
    this.suspect.firstname = '';
    this.suspect.middlename = '';
    this.suspect.lastname = '';
    this.suspect.description.ethnicity = '';
    this.suspect.sex = '';
    this.suspect.civilStatus = '';
    this.suspect.homeAddress = {
      region: '',
      province: '',
      municipality: '',
      barangay: '',
      street: '',
      block: '',
      locationId: 0,
      zipCode: 0
    };
    this.suspect.workAddress = {
      region: '',
      province: '',
      municipality: '',
      barangay: '',
      street: '',
      block: '',
      locationId: 0,
      zipCode: 0
    };
    
    this.sus_home_zip_code = '';
    this.sus_work_zip_code = '';
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

  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     const selectedFile = fileInput.files[0];
  //     this.idData.filename = selectedFile;
  //      this.idData.contentType = selectedFile.type;
      
  
  //     console.log('Selected file:', selectedFile);
  //     console.log('Content Type:', this.idData.contentType);
  //     console.log('Description:', this.idData.description);
  
    
  //     this.setRoleBasedOnUpload(true);
  //   } else {
  //     this.setRoleBasedOnUpload(false);
  //   }
  // }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
  
      // Directly store the file object in idData
      this.idData.file = selectedFile;
      this.idData.contentType = selectedFile.type;
      this.idData.filename = selectedFile.name;
      this.idData.description = this.idData.description || ''; // Default to empty string
      this.idData.extension = selectedFile.type.split('/')[1]; // Extract the file extension from MIME type
  
      console.log('Selected file:', selectedFile);
      console.log('Content Type:', this.idData.contentType);
      console.log('Description:', this.idData.description);
  
      this.setRoleBasedOnUpload(true); // Assuming you have this method to handle state change
    } else {
      this.setRoleBasedOnUpload(false); // Handle case where no file is selected
    }
  }
  


  setRoleBasedOnUpload(isUploaded: boolean) {
    this.witnessData.role = isUploaded ? 'Certified' : 'Uncertified';
  }


  isUnderInfluence(): boolean {
    return (this.suspect.description?.drug ?? false) || (this.suspect.description?.alcohol ?? false);
  }

  checkIfSamePerson() {
    this.isSamePerson = this.witness.firstname === this.victim.firstname &&
                       this.witness.lastname === this.victim.lastname;
  }

  async openSignatureModal() {
    const modal = await this.modalController.create({
      component: SignatureModalComponent,
    });
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data && data.signatureData) {
      const { mimeType, byteArray } = this.convertDataUrlToUint8Array(data.signatureData);
  
      // Directly store the byte array in reportData
      this.reportData.eSignature = byteArray;
      this.reportData.signatureExt = mimeType.split('/')[1];
  
      // console.log('Signature captured as byte array:', this.reportData.eSignature);
      // console.log('Signature MIME type:', mimeType);
    }
  }
  
  convertDataUrlToUint8Array(dataUrl: string): { mimeType: string; byteArray: Uint8Array } {
    const arr = dataUrl.split(',');
    const mimeType = arr[0].match(/:(.*?);/)![1];
    const binaryString = atob(arr[1]);
    const byteArray = new Uint8Array(binaryString.length);
  
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
  
    return { mimeType, byteArray };
  }


 getLocation(locationId: number): Promise<any> {
    return this.locationService.getLocation(locationId).toPromise();
  }


  async retrieveSessionData() {

    const userDataString = sessionStorage.getItem('userData');
   
  
    if (userDataString) {
      this.userData = JSON.parse(userDataString);
      console.log('Retrieved user data:', this.userData);
  
      let targetObject: any;

      // targetObject.description = targetObject.description || {
      //   descriptionId: 0,
      //   ethnicity: '',
      //   personId: 0,
      //   occupation: { occupationId: 0, name: '' }
      // };


      if (this.reporterType === 'victim') {
        targetObject = this.victim;
      } else if (this.reporterType === 'witness') {
        targetObject = this.witness;
      } else {
        console.log('Unknown reporter type:', this.reporterType);
        return;
      }
  
      // Map userData to targetObject
      targetObject = {
        firstname: this.userData.first_name || '',
        middlename: this.userData.middle_name || '',
        lastname: this.userData.last_name || '',
        birthdate: this.userData.birth_date || '',
        sex: this.mapGender(this.userData.sex),
        personId: this.userData.personId || 0,
        role: this.userData.role || '',
        bioStatus: this.userData.bioStatus || false,
        
      };
      targetObject.contactDetails = {
        email: this.userData.email || '',
        mobileNum: this.userData.contact_num || '',
        telNum: this.userData.tel_num || '',
      }

      if (this.userData.home_address_id) {
        const homeAddress = await this.getLocation(this.userData.home_address_id);
        if (homeAddress) {
          console.log("Home Address:", homeAddress);
      
          // Spread the homeAddress properties and add zipCode
          targetObject.homeAddress = { 
            ...homeAddress, 
            zipCode: this.extractZipCode(this.userData.home_address_id)
          };

        //  this.copyAddress(homeAddress, this.witness.homeAddress)

      
          console.log("Extracted home zip code:", this.extractZipCode(this.userData.home_address_id));

          if(this.reporterType === 'witness'){
            this.isWitnessDataLoaded = true;
            this.witness.homeAddress = targetObject.homeAddress
            this.comp_home_zip_code = this.extractZipCode(this.userData.home_address_id);
            console.log("Home Address Zip Code After Assignment:", this.comp_home_zip_code);
          }else if (this.reporterType === 'victim'){
            this.isVictimDataLoaded = true;
            this.victim.homeAddress = targetObject.homeAddress
            this.vic_home_zip_code = this.extractZipCode(this.userData.home_address_id);
            console.log("Home Address Zip Code After Assignment:", this.vic_home_zip_code);
          } 
        }
      }
      
      if (this.userData.work_address_id) {
        const workAddress = await this.getLocation(this.userData.work_address_id);
        if (workAddress) {
          console.log("Work Address:", workAddress);
      
         // Spread the workAddress properties and add zipCode
          targetObject.workAddress = { 
            ...workAddress,
            zipCode: this.extractZipCode(this.userData.work_address_id)  // Set zipCode from work address
          };

         
      
          console.log("Extracted work zip code:", this.extractZipCode(this.userData.work_address_id));

          if(this.reporterType === 'witness'){
            this.isWitnessDataLoaded = true;
            this.witness.workAddress = targetObject.workAddress
            this.comp_work_zip_code = this.extractZipCode(this.userData.work_address_id);
            console.log("Work Address Zip Code After Assignment:", this.comp_work_zip_code);
          } else if(this.reporterType === 'victim') {
            this.isVictimDataLoaded = true;
            this.victim.workAddress = targetObject.workAddress
            this.vic_work_zip_code = this.extractZipCode(this.userData.work_address_id);
            console.log("Work Address Zip Code After Assignment:", this.vic_work_zip_code);
          }
      
        
        }
      }
      
    
  
      console.log('Populated data:', targetObject);
  
      // Assign to victim or witness
      if (this.reporterType === 'victim') {
        this.victim = { ...targetObject };
      } else if (this.reporterType === 'witness') {
        this.witness = { ...targetObject };
      }
      this.isDataLoaded = true;
    } else {
      console.log('No user data found in session');
    }
  }



private mapGender(sex: string): string {
  const genderMap: { [key: string]: string } = { M: 'Male', F: 'Female' };
  return genderMap[sex] || sex || 'Unknown';
}

extractZipCode(locationId: number): number {
  if (!locationId) {
    console.warn('Invalid location_id for extracting zip code');
    return 0; // Default value for missing or invalid location_id
  }
  return parseInt(locationId.toString().slice(0, 4), 10) || 0;
}



  /**************************************************************************************************/
  /****************************************SEGMENT***************************************************/
  /**************************************************************************************************/

  segmentChanged(event: any) {
    console.log('Segment changed', event.detail.value);
    if (this.isSegmentDisabled(event.detail.value)) {
      console.log('Segment is disabled, reverting to previous segment');
      this.selectedSegment = this.getPreviousValidSegment();
    } else {
      this.selectedSegment = event.detail.value;
      this.expandSegment();
    }
  }

  expandSegment() {
    this.isExpanded = true;
  }

  collapseSegment() {
    this.isExpanded = false;
  }

  goToNextSegment(currentSegment: number) {
    // Convert the current segment to a number
    let nextSegment = currentSegment + 1;
  
    // Skip disabled segments
    while (this.isSegmentDisabled(nextSegment.toString())) {
      nextSegment++;
    }
  
    // Ensure we don't go beyond the last segment
    const lastSegment = 4; // Assuming you have 4 segments
    if (nextSegment > lastSegment) {
      nextSegment = lastSegment;
    }
  
    // Update the selected segment
    this.selectedSegment = nextSegment.toString();
  
    // Log the new segment for debugging
    console.log('Moving to segment:', this.selectedSegment);
  }

  getPreviousValidSegment(): string {
    const storedReporterType = localStorage.getItem('reporterType');
    if (storedReporterType === 'victim') {
      return this.selectedSegment === '1' ? '2' : this.selectedSegment;
    }
    return this.selectedSegment;
  }

  proceedToNextSegment() {
    
    // this.selectedSegment = 2;
    setTimeout(() => {
      this.goToNextSegment(this.selectedSegment); 
    }, 2000);
      console.log('Proceeding to the next segment...');
      
      
    }
  
    isSegmentDisabled(segment: string): boolean {
      return this.reporterType === 'victim' && segment === '1';
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

  updateBirthdate(entity: 'witness' | 'suspect' | 'victim') {
    if (entity === 'witness') {
      this.witness.birthdate = this.witnessDateOfBirth;
    } else if (entity === 'suspect') {
      this.suspect.birthdate = this.suspectDateOfBirth;
    } else if (entity === 'victim') {
      this.victim.birthdate = this.victimDateOfBirth;
    }
  }
  

  updateIncidentDate() {
    if (this.incidentDate) {
      // Replace 'T' with a space
      const formattedDate = this.incidentDate.replace('T', ' ');
      console.log('Incident date and time updated:', formattedDate);
  
      // Assign the formatted date to reportData
      this.reportData.incidentDate = formattedDate;
    }
  }
  

  updateReportedDate() {
    console.log('Reported date updated:', this.reportedDate);
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
      this.indexCrimes = data.map(crime => ({
        ...crime,
        reportCategoryId: 211 
      }));
    });
  
    this.crimeService.getNonIndexCrimes().subscribe(data => {
      this.nonIndexCrimes = data.map(crime => ({
        ...crime,
        reportCategoryId: 212 
      }));
    });
  }
  

  
  loadModus() {
    this.crimeService.getModus().subscribe(data => {
      this.modus = data;
    });


  }

  onModusChange(event: any) {
    const selectedMethod = event.detail.value;
  
    
    this.victim.victim.vicMethodId = selectedMethod.vicmethod_id;
    this.victim.victim.vicMethod = {
      vicMethodId: selectedMethod.vicmethod_id,
      methodName: selectedMethod.method_name
    };
  }
  


  onCrimeChange(event: any) {
    const selectedIncidentID = event.detail.value;
  
    // Find the selected incident type from the loaded incidentTypes
    const selectedIncident = this.incidentTypes.find(
      (incident) => incident.incident_id === selectedIncidentID
    );
  
    if (selectedIncident) {
      
      this.reportData.reportSubCategory = {
        reportSubCategoryId: selectedIncident.incident_id,  
        reportCategoryId: selectedIncident.incident_id,     
        subCategoryName: selectedIncident.name,             
      };
  
      console.log("Selected Incident Name:", this.reportData.reportSubCategory.subCategoryName);
      console.log("Selected Incident ID:", this.reportData.reportSubCategory.reportSubCategoryId);
      console.log("Category ID (same as Incident ID):", this.reportData.reportSubCategory.reportCategoryId);
    } else {
      console.warn("Selected incident not found.");
    }
  }
  

loadIncidentTypes() {
  this.crimeService.loadIncidentTypes().subscribe((incidentData: IncidentType[]) => {
    this.incidentTypes = incidentData;

    this.incidentTypeMap = {};
    incidentData.forEach(incident => {
      this.incidentTypeMap[incident.incident_id] = incident.name;
    });
  }, error => {
    console.error('Error loading incident types', error);
  });
}
  
  /**************************************************************************************************/
  /****************************************EXTRACT LOC***********************************************/
  /**************************************************************************************************/





  getCurrentLocation(): Promise<void> {
    this.isLoadingLocation = true; // Set loading state to true
    this.loadingMessage = 'Loading your current location...'; // Set loading message
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    console.log('Latitude:', this.latitude);
                    console.log('Longitude:', this.longitude);
                    this.getLocationName(this.latitude, this.longitude).then((name) => {
                        this.locationName = name; // Set the location name
                        resolve(); // Resolve the promise
                        this.isLoadingLocation = false; 
                    }).catch((error) => {
                        console.error(error);
                        this.locationName = 'Could not retrieve location name.';
                        resolve(); // Resolve even on error to avoid blocking
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    this.locationName = this.handleLocationError(error);
                    this.isLoadingLocation = false; 
                    resolve(); // Resolve even on error to avoid blocking
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0,
                }
            );
        } else {
            this.locationName = 'Geolocation is not supported by this browser.';
            console.error(this.locationName);
            this.isLoadingLocation = false; 
            resolve(); // Resolve if geolocation is not supported
        }
    });
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

async loadPoliceStations() {
  try {
    const data = await this.http.get<any[]>('assets/location/jurisdiction1.json').toPromise();
    
    // Check if data is defined and is an array
    if (Array.isArray(data)) {
      this.policeStations = data; // Store the police stations data
    } else {
      console.error('Expected an array but received:', data);
      this.policeStations = []; // Assign an empty array if data is not valid
    }
  } catch (error) {
    console.error('Error loading police stations:', error);
    this.policeStations = []; // Assign an empty array on error
  }
}



closeModal() {
  this.isModalOpen = false; 
}

goBack() {
  this.closeModal(); 
  setTimeout(() => {
    this.router.navigate(['/tabs/home']);
  }, 100);
}


  /**************************************************************************************************/
  /***********************************************SAVE***********************************************/
  /**************************************************************************************************/

  genderToLetter(gender: string){
    switch(gender){
      case 'Male':
        return 'M';
      case 'Female':
        return 'F';
      case 'Prefer not to say':
        return 'X';
      default:
        return 'X'; 
    }
  }

  async saveWitness() {
    this.witness.homeAddress.zipCode = Number(this.comp_home_zip_code);
    this.witness.workAddress.zipCode = Number(this.comp_work_zip_code);
  

  
    const witnessPerson = {
      personId: this.witness.personId,
      firstname: this.witness.firstname,
      middlename: this.witness.middlename,
      lastname: this.witness.lastname,
      sex: this.genderToLetter(this.witness.sex),
      birthdate: this.witness.birthdate,
      civilStatus: this.witness.civilStatus,
      bioStatus: this.witness.bioStatus,
    };
  
    this.personService.createPerson(witnessPerson).pipe(
      switchMap((personResponse: any) => {
        console.log('Witness Person saved successfully', personResponse);
        const personId = personResponse.id || this.witness.personId;
  
        // Update witness object with the retrieved personId
        this.witness.personId = personId;
  
        const hasHomeAddress = this.witness.homeAddress && this.witness.homeAddress.zipCode;
        const hasWorkAddress = this.witness.workAddress && this.witness.workAddress.zipCode;
  
        const homeLocation$ = hasHomeAddress
          ? this.locationService.createOrRetrieveLocation(this.witness.homeAddress, this.witness.homeAddress.zipCode).pipe(
              tap((homeLocationResponse) => {
                console.log('Witness Home location saved successfully:', homeLocationResponse);
              }),
              catchError((error) => {
                console.error('Failed to save witness home location:', error);
                return EMPTY;
              })
            )
          : of(null);
  
        const workLocation$ = hasWorkAddress
          ? this.locationService.createOrRetrieveLocation(this.witness.workAddress, this.witness.workAddress.zipCode).pipe(
              tap((workLocationResponse) => {
                console.log('Witness Work location saved successfully:', workLocationResponse);
              }),
              catchError((error) => {
                console.error('Failed to save witness work location:', error);
                return EMPTY;
              })
            )
          : of(null);
  
        return forkJoin({
          homeLocation: homeLocation$,
          workLocation: workLocation$
        }).pipe(
          switchMap(() => {
            return this.witnessService.establishWitness(personId).pipe(
              tap((witnessResponse) => {
                console.log('Witness saved successfully', witnessResponse);
              }),
              switchMap(() => {
               
                const descriptionData = {
                  descriptionId: this.witness.description?.descriptionId,
                  ethnicity: this.witness.description?.ethnicity,
                  personId: personId
                }
                return this.descriptionService.establishDescription(descriptionData).pipe(
                  tap((descriptionResponse) => {
                    console.log('Witness Description saved successfully', descriptionResponse);
                    console.log('UNSA MAN GYD KANG DESCRIPTION!!!', this.witness.description)

                  }),
                  catchError((error) => {   
                    console.log('UNSA MAN GYD KA DESCRIPTION!!', this.witness.description)
                    console.error('Failed to save witness description:', error);
                    return EMPTY;
                  })
                );
              })
            );
          })
        );
      })
    ).subscribe({
      next: () => {
        console.log('All witness data saved successfully');
      },
      error: (error) => {
        console.error('Error occurred during witness save process:', error);
      }
    });
  }
  

   async saveSuspect(reportId: number){

      this.suspect.homeAddress.zipCode = Number(this.sus_home_zip_code);
      this.suspect.workAddress.zipCode = Number(this.sus_work_zip_code);

    const suspectPerson =  {
    personId: this.suspect.personId,
    firstname: this.suspect.firstname,
    middlename: this.suspect.middlename,
    lastname: this.suspect.lastname,
    sex: this.genderToLetter(this.suspect.sex),
    birthdate: this.suspect.birthdate,
    civilStatus: this.suspect.civilStatus,
    bioStatus: this.suspect.bioStatus
  };

 
  if (this.suspect.isUnidentified) {
    const descriptionData = {
      descriptionId: 0,
      ethnicity: this.suspect.description.ethnicity,
      height: this.suspect.description.height,
      weight: this.suspect.description.weight,
      eyeColor: this.suspect.description.eyeColor,
      hairColor: this.suspect.description.hairColor,
      drug: this.suspect.description.drug,
      alcohol: this.suspect.description.alcohol,
      distinguishingMark: this.suspect.description.distinguishingMark,
      personId: null,
     
    };
  

    if (!this.validateObject(this.suspect)) {
      console.error('Suspect validation failed.');
      return;
    }
    this.descriptionService.establishDescription(descriptionData).pipe(
      switchMap((descriptionResponse: any) => {
        console.log('Description saved successfully for unidentified person:', descriptionResponse);
  
        const suspectData: SuspectCommon = {
          ...this.suspect
        };
  
        return this.suspectService.establishSuspect(suspectData);
      })
    ).subscribe(
      (suspectResponse: any) => {
        console.log('Suspect saved successfully', suspectResponse);
      },
      (error) => {
        console.error('Failed to save suspect for unidentified person:', error);
      }
    );
  } else {
  
    this.personService.createPerson(suspectPerson).pipe(
      switchMap((personResponse: any) => {
        console.log('Suspect Person saved successfully', personResponse);
        const personId = personResponse.id;
  
        const hasHomeAddress = this.suspect.homeAddress && this.suspect.homeAddress.zipCode;
        const hasWorkAddress = this.suspect.workAddress && this.suspect.workAddress.zipCode;
  
        const homeLocation$ = hasHomeAddress
          ? this.locationService.createOrRetrieveLocation(this.suspect.homeAddress, this.suspect.homeAddress.zipCode).pipe(
              tap((homeLocationResponse) => {
                console.log('Suspect Home location saved successfully:', homeLocationResponse);
              }),
              catchError((error) => {
                console.error('Failed to save suspect home location:', error);
                return EMPTY;
              })
            )
          : of(null);
  
        const workLocation$ = hasWorkAddress
          ? this.locationService.createOrRetrieveLocation(this.suspect.workAddress, this.suspect.workAddress.zipCode).pipe(
              tap((workLocationResponse) => {
                console.log('Suspect Work location saved successfully:', workLocationResponse);
              }),
              catchError((error) => {
                console.error('Failed to save suspect work location:', error);
                return EMPTY;
              })
            )
          : of(null);
  
        return homeLocation$.pipe(
          switchMap(() => workLocation$),
          switchMap(() => {
            const descriptionData = {
              descriptionId: 0,
              ethnicity: this.suspect.description.ethnicity,
              height: this.suspect.description.height,
              weight: this.suspect.description.weight,
              eyeColor: this.suspect.description.eyeColor,
              hairColor: this.suspect.description.hairColor,
              drug: this.suspect.description?.drug,
              alcohol: this.suspect.description?.alcohol,
              distinguishingMark: this.suspect.description.distinguishingMark,
              personId: personId,  
            
            };
  
            return this.descriptionService.establishDescription(descriptionData).pipe(
              switchMap((descriptionResponse: any) => {
                console.log('Description saved successfully:', descriptionResponse);
  
                
                const suspect: Suspect = {
                  suspectId: this.suspect.suspect.suspectId,
                  personId: personId,
                  isCaught: this.suspect.suspect.isCaught,
                  
                };
  
                return this.suspectService.establishCriminal(reportId, suspect);
              })
            );
          })
        );
      })
    ).subscribe(
      (suspectResponse: any) => {
        console.log('Suspect saved successfully', suspectResponse);
      },
      (error) => {
        console.error('Failed to save suspect:', error);
      }
    );
  }

  }

  // async saveVictim(reportId: number) {
  //   const victimPerson = {
  //     personId: this.victim.personId,
  //     firstname: this.victim.firstname,
  //     middlename: this.victim.middlename,
  //     lastname: this.victim.lastname,
  //     sex: this.genderToLetter(this.victim.sex),
  //     birthdate: this.victim.birthdate,
  //     civilStatus: this.victim.civilStatus,
  //     bioStatus: this.victim.bioStatus,
  //   };
  
  //   if (!this.validateObject(this.victim)) {
  //     console.error('Victim validation failed.');
  //     return;
  //   }

  //   if(this.reporterType === 'witness'){

  //     this.personService.createPerson(victimPerson).pipe(
  //       switchMap((personResponse: any) => {
  //         console.log('Victim Person saved successfully', personResponse);
  //         const personId = personResponse.id || this.victim.personId; 
    
  //         // Add the personId to victim's description
  //         // this.victim.description.personId = personId;
    
  //         const hasHomeAddress = this.victim.homeAddress && this.victim.homeAddress.zipCode;
  //         const hasWorkAddress = this.victim.workAddress && this.victim.workAddress.zipCode;
    
  //         const homeLocation$ = hasHomeAddress
  //           ? this.locationService.createOrRetrieveLocation(this.victim.homeAddress, this.victim.homeAddress.zipCode).pipe(
  //               tap((homeLocationResponse) => {
  //                 console.log('Victim Home location saved successfully:', homeLocationResponse);
  //               }),
  //               catchError((error) => {
  //                 console.error('Failed to save victim home location:', error);
  //                 return EMPTY;
  //               })
  //             )
  //           : of(null);
    
  //         const workLocation$ = hasWorkAddress
  //           ? this.locationService.createOrRetrieveLocation(this.victim.workAddress, this.victim.workAddress.zipCode).pipe(
  //               tap((workLocationResponse) => {
  //                 console.log('Victim Work location saved successfully:', workLocationResponse);
  //               }),
  //               catchError((error) => {
  //                 console.error('Failed to save victim work location:', error);
  //                 return EMPTY;
  //               })
  //             )
  //           : of(null);
    
  //         return forkJoin({
  //           homeLocation: homeLocation$,
  //           workLocation: workLocation$
  //         }).pipe(
  //           switchMap((results) => {
  //             console.log('Additional data saved successfully:', results);
    
  //             const victim: Victim = {
  //               victimId: this.victim.victim.victimId,
  //               personId: personId,
  //               vicMethodId: this.selectedmodus.vicmethod_id, 
  //               vicMethod: {
  //                 vicMethodId: this.selectedmodus.vicmethod_id, 
  //                 methodName: this.selectedmodus.method_name
  //               }
  //             };
    
  //             return this.victimService.establishVictim(victim, reportId).pipe(
  //               switchMap((victimResponse: any) => {
  //                 console.log('Victim saved successfully', victimResponse);
    
  //                 // After saving victim, save the description
  //                 return this.descriptionService.establishDescription(this.victim.description).pipe(
  //                   tap((descriptionResponse) => {
  //                     console.log('Victim Description saved successfully', descriptionResponse);
  //                   }),
  //                   catchError((error) => {
  //                     console.error('Failed to save victim description:', error);
  //                     return EMPTY;
  //                   })
  //                 );
  //               })
  //             );
  //           })
  //         );
  //       })
  //     ).subscribe({
  //       next: () => {
  //         console.log('All data saved successfully');
  //       },
  //       error: (error) => {
  //         console.error('Error occurred during save process:', error);
  //       }
  //     });

  //   } else if (this.reporterType === 'victim') {
      
  //   }
  
   
  // }

  async saveVictim(reportId: number) {
    const victimPerson = {
      personId: this.victim.personId,
      firstname: this.victim.firstname,
      middlename: this.victim.middlename,
      lastname: this.victim.lastname,
      sex: this.genderToLetter(this.victim.sex),
      birthdate: this.victim.birthdate,
      civilStatus: this.victim.civilStatus,
      bioStatus: this.victim.bioStatus,
    };
  
    if (!this.validateObject(this.victim)) {
      console.error('Victim validation failed.');
      return;
    }
  
    if (this.reporterType === 'witness') {
      this.personService.createPerson(victimPerson).pipe(
        switchMap((personResponse: any) => {
          console.log('Victim Person saved successfully', personResponse);
          const personId = personResponse.id || this.victim.personId;
  
          const hasHomeAddress = this.victim.homeAddress && this.victim.homeAddress.zipCode;
          const hasWorkAddress = this.victim.workAddress && this.victim.workAddress.zipCode;
  
          const homeLocation$ = hasHomeAddress
            ? this.locationService.createOrRetrieveLocation(this.victim.homeAddress, this.victim.homeAddress.zipCode).pipe(
                tap((homeLocationResponse) => {
                  console.log('Victim Home location saved successfully:', homeLocationResponse);
                }),
                catchError((error) => {
                  console.error('Failed to save victim home location:', error);
                  return EMPTY;
                })
              )
            : of(null);
  
          const workLocation$ = hasWorkAddress
            ? this.locationService.createOrRetrieveLocation(this.victim.workAddress, this.victim.workAddress.zipCode).pipe(
                tap((workLocationResponse) => {
                  console.log('Victim Work location saved successfully:', workLocationResponse);
                }),
                catchError((error) => {
                  console.error('Failed to save victim work location:', error);
                  return EMPTY;
                })
              )
            : of(null);
  
          return forkJoin({
            homeLocation: homeLocation$,
            workLocation: workLocation$
          }).pipe(
            switchMap((results) => {
              console.log('Additional data saved successfully:', results);
  
              const victim: Victim = {
                victimId: this.victim.victim.victimId,
                personId: personId,
                vicMethodId: this.selectedmodus.vicmethod_id, 
                vicMethod: {
                  vicMethodId: this.selectedmodus.vicmethod_id, 
                  methodName: this.selectedmodus.method_name
                }
              };
  
              return this.victimService.establishVictim(victim, reportId).pipe(
                switchMap((victimResponse: any) => {
                  console.log('Victim saved successfully', victimResponse);
  
                  return this.descriptionService.establishDescription(this.victim.description).pipe(
                    tap((descriptionResponse) => {
                      console.log('Victim Description saved successfully', descriptionResponse);
                    }),
                    catchError((error) => {
                      console.error('Failed to save victim description:', error);
                      return EMPTY;
                    })
                  );
                })
              );
            })
          );
        })
      ).subscribe({
        next: () => {
          console.log('All data saved successfully');
        },
        error: (error) => {
          console.error('Error occurred during save process:', error);
        }
      });
  
    } else if (this.reporterType === 'victim') {
      // Load userData from sessionStorage
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
  
        // Assign userData to victim
       const victim = {
          personId: parsedUser.personId,
          firstname: parsedUser.firstname,
          middlename: parsedUser.middlename,
          lastname: parsedUser.lastname,
          sex: parsedUser.sex,
          birthdate: parsedUser.birthdate,
          civilStatus: parsedUser.civilStatus,
          bioStatus: parsedUser.bioStatus,
          homeAddress: parsedUser.homeAddress || {},  
          workAddress: parsedUser.workAddress || {},
          vicMethodId: this.selectedmodus.vicmethod_id, 
          vicMethod: {
            vicMethodId: this.selectedmodus.vicmethod_id, 
            methodName: this.selectedmodus.method_name
          }  
        };
  
        console.log('Loaded existing userData as victim:', this.victim);
  
        // Save the victim using the retrieved data
        this.victimService.establishVictim(victim, reportId).pipe(
          switchMap((victimResponse: any) => {
            console.log('Victim saved successfully:', victimResponse);
  
            // Save victim description
            return this.descriptionService.establishDescription(this.victim.description).pipe(
              tap((descriptionResponse) => {
                console.log('Victim Description saved successfully:', descriptionResponse);
              }),
              catchError((error) => {
                console.error('Failed to save victim description:', error);
                return EMPTY;
              })
            );
          })
        ).subscribe({
          next: () => {
            console.log('Victim and description saved successfully.');
          },
          error: (error) => {
            console.error('Error occurred while saving victim description:', error);
          }
        });
  
      } else {
        console.error('No existing userData found in sessionStorage.');
      }
    }
  }
  
 
  
  async saveIncidentLocation() {
    this.incidentPlace.zipCode = Number(this.inc_zip_code);
  
    try {
      const locationDetails = {
        province: this.getProvinceName(this.incidentPlace.province),
        barangay: this.getBarangayName(this.incidentPlace.barangay),
        street: this.incidentPlace.street,
        region: this.getRegionName(this.incidentPlace.region),
        municipality: this.getMunicipalityName(this.incidentPlace.municipality),
        zipCode: this.incidentPlace.zipCode,
        block: this.incidentPlace.block
      };
  
  
      console.log('Converted Location Details:', locationDetails);
      const locationId = await this.locationService
      .createOrRetrieveLocation(locationDetails, locationDetails.zipCode)
      .pipe(
        map((response) => {
          console.log('Full response:', response); // Log the entire response
          if (!response?.locationId) {
            throw new Error('Invalid response: locationId is undefined');
          }
          return response.locationId;
        })
      )
      .toPromise(); // Convert the Observable to a Promise

    console.log('Location saved successfully:', locationId);
    this.reportData.locationId = locationId;
  } catch (error) {
    console.log('Incident Location Error:', this.reportData.locationId);
    console.error('Error saving location:', error);
    throw error;
  }
  }
  
  
  

  async prepareFormData(formData: FormData){

    // const formData = new FormData();
    formData.append('reportId', this.reportData.reportId.toString());
    formData.append('reportBody', this.reportData.reportBody);
    formData.append('citizenId', this.reportData.citizenId.toString());
    formData.append('stationId', this.reportData.stationId.toString());
    formData.append('incidentDate', this.incidentDate);
    formData.append('blotterNum', this.reportData.blotterNum);
    formData.append('hasAccount', this.reportData.hasAccount.toString());
    formData.append(
        'reportSubCategoryId',
        this.reportData.reportSubCategory?.reportCategoryId.toString() || ''
    );

    if (this.reportData.locationId !== undefined) {
      formData.append('locationId', this.reportData.locationId.toString());
  } else {
      console.error('Error: locationId is undefined.');
      throw new Error('locationId is required but is undefined.');
  }

  if (this.reportData.eSignature instanceof Uint8Array || Array.isArray(this.reportData.eSignature)) {
    try {
      const blob = new Blob([new Uint8Array(this.reportData.eSignature)], { type: `image/${this.reportData.signatureExt}` });
      formData.append('ESignature', blob, `signature.${this.reportData.signatureExt}`);
      console.log(`ESignature added successfully as a blob with extension: ${this.reportData.signatureExt}`);
    } catch (error) {
      console.error('Failed to append ESignature to the form data:', error);
    }
  } else {
    console.error('Invalid eSignature format. It must be an instance of Uint8Array or an array.');
  }
  

    return formData;

  }

  async saveProof() {
    const citizenID = this.reportData.citizenId;
  
    const formDataMedium = new FormData();
    formDataMedium.append('CitizenId', citizenID.toString());
  
    // Ensure `Proof` is the actual file object
    if (this.idData.file instanceof File) {
      formDataMedium.append('Proof', this.idData.file, this.idData.filename); // Pass the file object and the file name
    } else {
      console.error('No valid file object found in idData.file');
      return;
    }
  
    formDataMedium.append('Description', this.idData.description || '');
    formDataMedium.append('ProofExt', this.idData.extension || '');
  
    this.citizenService.updateCitizen(formDataMedium, citizenID).subscribe(
      (mediaResponse) => {
        console.log('Media uploaded successfully:', mediaResponse);
      },
      (mediaError) => {
        console.error('Error uploading media:', mediaError);
      }
    );
  }
  



  async saveNearby() {

    const locationName = this.locationName;
    const station = this.policeStations.find(station => 
      station.jurisdiction.includes(locationName),
      console.log('Your current location is:', locationName )
    );
    this.reportData.stationId = 7;
  
  //   if (station) {
  //     console.log(`Found station: ${station.stationName} with ID: ${station.stationId}`);
  //     //this.reportData.stationId = station.stationId;
  //     this.reportData.stationId = 7
  //   } else {
  //     console.error('No station found for the current location.');
  //     return;
  //   }   
   }

  async confirmMessage(){

    const locationName = this.locationName;
    const station = this.policeStations.find(station => 
      station.jurisdiction.includes(locationName),
      console.log('Your current location is:', locationName )
    );

    this.loadingMessage = `Report submitted to ${station.stationName}`;
    this.stationName = station.stationName;
     
     this.loading = false;
  }

  validateSignature(signature: number[] | Uint8Array | Blob): boolean {
    if (Array.isArray(signature) || signature instanceof Uint8Array) {
      return signature.length > 0; // Check if the array or Uint8Array has content
    } else if (signature instanceof Blob) {
      return signature.size > 0; // Check if the Blob has content
    }
    return false; // Invalid type
  }
  

  validateObject(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
  
       
        if (typeof value === 'object' && value !== null) {
          if (!this.validateObject(value)) return false;
        }
  
      
        else if (value === null || value === undefined || value === '') {
          console.error(`Validation failed: ${key} is empty or invalid`);
          return false;
        }
      }
    }
  
    return true;
  }
  




  async save() {


    await this.saveIncidentLocation();
    await this.getCurrentLocation();
    await this.saveNearby();
    await this.saveProof();

    const form = new FormData();
    let isValidReporter: boolean = false;
    let isValidSuspect: boolean = false;
  
    if (this.reporterType === 'witness') {
     
      isValidReporter = this.validateObject(this.witness);
      if (!isValidReporter) {
        console.error('Invalid witness data');
        return;
      }
    } else if (this.reporterType === 'victim') {
   
      isValidReporter = this.validateObject(this.victim);
      if (!isValidReporter) {
        console.error('Invalid victim data');
        return;
      }
    }
    
    if (this.suspect.isUnidentified) {
      console.log('Suspect is unidentified, validation skipped.');
      isValidSuspect = true;
    
    } else {
      isValidSuspect = this.validateObject(this.suspect);
      if (!isValidSuspect) {
        console.error('Suspect validation failed:', this.suspect);
      }
    }
    
    const isValidReport = this.validateObject(this.reportData);
  
 
    if (!isValidReporter || !isValidSuspect || !isValidReport) {
      this.showValidationMessages = true;
      console.error('Validation Errors:', {
        reporter: !isValidReporter,
        suspect: !isValidSuspect,
        report: !isValidReport,
      });
      return; 
    }
  
    this.showValidationMessages = false;

  
   
    try {
      const response = await this.reportService.establishReport(await this.prepareFormData(form)).toPromise();
      console.log('Report submitted successfully:', response);
  
      const reportId = response.id;
      if (!reportId) {
        console.error('Report ID is undefined in the response.');
        return;
      }
  
      await this.saveSuspect(reportId);
      await this.saveReporter(reportId);
      await this.saveVictim(reportId); 
  
      this.router.navigate(['/add-evidence'], {
        state: {
          citizenId: this.userData.citizenId,
          reportId: reportId,
        },
      });
  
      
    } catch (error) {
      console.error('Error submitting report:', error);
    }
    this.loading = false;
  }
  
 
  async saveReporter(reportId: number) {
    if (this.reporterType === 'witness') {
    
      await this.saveWitness();
    } else if (this.reporterType === 'victim') {
    
      await this.saveVictim(reportId);
    }
  }


}
