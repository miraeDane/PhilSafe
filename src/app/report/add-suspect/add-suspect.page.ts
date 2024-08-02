import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-suspect',
  templateUrl: './add-suspect.page.html',
  styleUrls: ['./add-suspect.page.scss'],
})
export class AddSuspectPage implements OnInit {

  @ViewChild('datePicker', { static: false }) datePicker: any;


  selectedSegment: string = 'segment1';
  dateOfBirth: string;

  constructor(private route: ActivatedRoute) {
    this.dateOfBirth = '';
   }

  ngOnInit() {
    
  }


  openDatePicker() {
    this.datePicker.open();
  }

  dateChanged(event:any) {
    this.dateOfBirth = event.detail.value;
  }


}
