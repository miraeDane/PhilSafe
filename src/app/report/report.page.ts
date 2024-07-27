import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  @ViewChild('datePicker', { static: false }) datePicker: any;


  selectedSegment: string = 'segment1';
  dateOfBirth: string;

  constructor(private route: ActivatedRoute) {
    this.dateOfBirth = '';
   }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const segment = params.get('segment');
      this.selectedSegment = segment ? segment : 'segment1';
    });
  }

  segmentChanged(event: any) {
    console.log('Segment changed', event.detail.value);
    this.selectedSegment = event.detail.value;
  }

  goToNextSegment(segment: string) {
    this.selectedSegment = segment;
  }

  openDatePicker() {
    this.datePicker.open();
  }

  dateChanged(event:any) {
    this.dateOfBirth = event.detail.value;
  }

  

}
