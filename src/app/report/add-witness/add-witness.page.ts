import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-witness',
  templateUrl: './add-witness.page.html',
  styleUrls: ['./add-witness.page.scss'],
})
export class AddWitnessPage implements OnInit {
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
