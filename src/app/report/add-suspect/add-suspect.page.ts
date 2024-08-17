import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { SuspectCommon } from '../../models/2suspect.model'; 
import { NavigationState } from 'src/app/models/navstate.model';

@Component({
  selector: 'app-add-suspect',
  templateUrl: './add-suspect.page.html',
  styleUrls: ['./add-suspect.page.scss'],
})
export class AddSuspectPage implements OnInit {

  @ViewChild('datePicker', { static: false }) datePicker: any;

  newSuspect: SuspectCommon = {
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

  returnPage: string = '';
  selectedSegment: string = 'segment1';
  dateOfBirth: string;

  constructor(
    private route: Router,
    private modalController: ModalController,
    private navCtrl: NavController,

  ) {
    this.dateOfBirth = '';
    
   }

  ngOnInit() {
    const navigation = this.route.getCurrentNavigation();
    const state = navigation?.extras.state as NavigationState;
    this.returnPage = state?.returnPage || '/report';
    
  }

  submitSuspect() {
    this.navCtrl.navigateBack(this.returnPage, {
      state: { newSuspect: this.newSuspect } 
    });
  }

  
  close() {
    this.modalController.dismiss();
  }


  openDatePicker() {
    this.datePicker.open();
  }

  dateChanged(event:any) {
    this.dateOfBirth = event.detail.value;
  }


}
