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
import { switchMap, concatMap, of, EMPTY, tap, catchError  } from 'rxjs';


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
    description: {descriptionId: 0, ethnicity: '', occupationId: 0, personId: 0},
    contactDetails: { email: '',  mobileNum: '', telNum: '' },
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
    contactDetails: { email: '',  mobileNum: '' },
    homeAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', zipCode: 0 },
    workAddress: { locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '',block:'', zipCode: 0 },
    description: { descriptionId: 0, ethnicity: '', height: 0, weight: 0, eyeColor: '', hairColor: '', drug: false, alcohol: false, distinguishingMark:'', personId: 0 },
    occupation: { occupationId: 0, name: '' },
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
    description: {descriptionId: 0, ethnicity: '', personId: 0},
    contactDetails: { email: '',  mobileNum: '' },
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
  selectedCrime: string = '';
  isIndexCrime: boolean = false;
  isDataLoaded: boolean = false;
  selectedReporterType: string = '';
  
  userData: any;
  reporterType: string = '';
  incidentDate: string = this.getCurrentDate();

  private formatDecimal(value: number | null | undefined): number {
    if (value == null) {
      return 0;
    }
    return Number(value.toFixed(2));
  }
  
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
    private personService: PersonService
    
  ) {
    this.dateOfBirth = new Date().toISOString().substring(0, 10);
    //this.incidentDate = new Date().toISOString().substring(0, 10);
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
  }

  /**************************************************************************************************/
  /***************************************LOCATION**************************************************/
  /*************************************************************************************************/

  onAddressCheckboxChange(event: any, type: 'witness' | 'suspect' | 'victim') {
    this.isSameAddress = event.detail.checked;

    if (this.isSameAddress) {
      if (type === 'witness') {
        this.copyAddress(this.witness.homeAddress, this.witness.workAddress);
      } else if (type === 'suspect') {
        this.copyAddress(this.suspect.homeAddress, this.suspect.workAddress);
      } else if (type === 'victim') {
        this.copyAddress(this.victim.homeAddress, this.victim.workAddress);
      }
    } else {
      if (type === 'witness') {
        this.resetAddress(this.witness.workAddress);
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
    this.suspect.occupation.name = '';
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
    if (data) {
      console.log('Signature Data:', data.signature);
     
    }
  }


  retrieveSessionData() {
    const userDataString = sessionStorage.getItem('userData');
    if (userDataString) {
      this.userData = JSON.parse(userDataString);
      console.log('Retrieved user data:', this.userData);
      
      let targetObject: any;
      if (this.reporterType === 'victim') {
        targetObject = this.victim;
      } else if (this.reporterType === 'witness') {
        targetObject = this.witness;
      } else {
        console.log('Unknown reporter type:', this.reporterType);
        return; 
      }
  

      const genderMap: { [key: string]: string } = {
        'M': 'Male',
        'F': 'Female'
      };
  
     
      targetObject.firstname = this.userData.first_name || '';
      targetObject.middlename = this.userData.middle_name || '';
      targetObject.lastname = this.userData.last_name || '';
      targetObject.birthdate = this.userData.birth_date || '';
      targetObject.sex = genderMap[this.userData.sex] || this.userData.sex || '';
      targetObject.contactDetails = {
        telNum: this.userData.tel_num || '',
        mobileNum: this.userData.contact_num || '',
        email: this.userData.email || ''
      };
      targetObject.personId = this.userData.personId || 0;
      targetObject.role = this.userData.role || '';
      targetObject.civilStatus = this.userData.civilStatus || '';
      targetObject.bioStatus = this.userData.bioStatus || false;
  
   
      targetObject.description = {
        descriptionId: 0,
        ethnicity: ''
      };
  
   
      targetObject.occupation = {
        occupationId: 0,
        name: ''
      };
  
    
      if (this.userData.home_address_id) {
        targetObject.homeAddressId = this.userData.home_address_id;
        targetObject.homeAddress = {
          locationId: 0,
          province: '',
          municipality: '',
          street: '',
          region: '',
          barangay: '',
          block: ''
        };
        
      }
      if (this.userData.work_address_id) {
        targetObject.workAddressId = this.userData.work_address_id;
        targetObject.workAddress = {
          locationId: 0,
          province: '',
          municipality: '',
          street: '',
          region: '',
          barangay: '',
          block: ''
        };
        
      }
  
      console.log('Populated data:', targetObject);
  
     
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
    }
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


  updateBirthdate() {
    this.witness.birthdate = this.dateOfBirth;
    this.suspect.birthdate = this.dateOfBirth;
    this.victim.birthdate = this.dateOfBirth;
  }

  updateIncidentDate() {
  
    console.log('Incident date updated:', this.incidentDate);
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


const heightNumber = parseFloat(this.sus_height);
const weightNumber = parseFloat(this.sus_weight);

const roundToDecimalPlaces = (number: number): number  => {
  return Math.round(number * 100) / 100; 
};
this.suspect.description.height = roundToDecimalPlaces(heightNumber);
this.suspect.description.weight = roundToDecimalPlaces(weightNumber);

  this.witness.homeAddress.zipCode = Number(this.comp_home_zip_code);
  this.witness.workAddress.zipCode = Number(this.comp_work_zip_code);

  this.suspect.homeAddress.zipCode = Number(this.sus_home_zip_code);
  this.suspect.workAddress.zipCode = Number(this.sus_work_zip_code);

  this.victim.homeAddress.zipCode = Number(this.vic_home_zip_code);
  this.victim.workAddress.zipCode = Number(this.vic_work_zip_code);

  const mapSexToLetter = (sex: string): string => {
    switch (sex) {
      case 'Male':
        return 'M';
      case 'Female':
        return 'F';
      case 'Prefer not to say':
        return 'X';
      default:
        return 'X'; 
    }
  };
 
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
    
  };


  console.log("Height", descriptionData.height);
  console.log("Type of Height", typeof descriptionData.height);
  console.log("Weight", descriptionData.weight);
  console.log("Type of Weight", typeof descriptionData.weight);
  // this.witnessService.establishWitness(this.witness.personId).subscribe(
  //   (response) => {
  //     console.log('Witness saved successfully', this.witness)
  //     console.log('Response:', response)
  //   },
  //   (error) => {
  //     console.error('Failed to save witness:', error);
  //   }
  // )

  // this.descriptionService.establishDescription(this.witness.description).subscribe(
  //   (response) => {
  //     console.log('Witness Description saved successfully', this.witness.description)
  //     console.log('Response:', response)
  //   },
  //   (error) => {
  //     console.error('Failed to save witness description:', error);
  //   }
  // )


  const suspectPerson =  {
    personId: this.suspect.personId,
    firstname: this.suspect.firstname,
    middlename: this.suspect.middlename,
    lastname: this.suspect.lastname,
    sex: mapSexToLetter(this.suspect.sex),
    birthdate: this.suspect.birthdate,
    civilStatus: this.suspect.civilStatus,
    bioStatus: this.suspect.bioStatus
  };

 
  if (this.suspect.isUnidentified) {
    // Unidentified suspect: Only save description
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
      personId: null // No personId because the person is unidentified
    };
  
    this.descriptionService.establishDescription(descriptionData).pipe(
      switchMap((descriptionResponse: any) => {
        console.log('Description saved successfully for unidentified person:', descriptionResponse);
  
        // Send the description to the suspect service
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
    // Identified suspect: Proceed with person, address, and suspect creation
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
              drug: this.suspect.description.drug,
              alcohol: this.suspect.description.alcohol,
              distinguishingMark: this.suspect.description.distinguishingMark,
              personId: personId // Use the personId for identified suspects
            };
  
            return this.descriptionService.establishDescription(descriptionData).pipe(
              switchMap((descriptionResponse: any) => {
                console.log('Description saved successfully:', descriptionResponse);
  
                // Send the description and personId to the suspect service
                const suspect: Suspect = {
                  suspectId: this.suspect.suspect.suspectId,
                  personId: personId,
                  isCaught: this.suspect.suspect.isCaught,
                  
                };
  
                return this.suspectService.establishSuspect(suspect);
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
  

  console.log('Witness Data: ',this.witness);
  console.log(this.selectedCrime);
  console.log(this.reportData.media);
  console.log('Suspect Data: ', this.suspect);
  console.log('Victim Data: ', this.victim);

}
  

}
