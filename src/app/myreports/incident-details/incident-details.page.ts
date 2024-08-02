import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.page.html',
  styleUrls: ['./incident-details.page.scss'],
})
export class IncidentDetailsPage implements OnInit {

  selectedSegment: string = 'case-details';
  crime_id: any;
  incident: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const segment = params.get('segment');
      this.selectedSegment = segment ? segment : 'case-details';

      this.crime_id = this.route.snapshot.paramMap.get('id');
    });
  }

  segmentChanged(event: any) {
    console.log('Segment changed', event.detail.value);
    this.selectedSegment = event.detail.value;
  }

  incidents = [
    { crime_id:'1',type: 'Rape', status: 'Reviewing', progress: 0.2 },
  
  ];
  
  getStatusClass(status: string): string {
    if (status === 'Reviewing') {
      return 'reviewing';
    } else if (status === 'Progressing') {
      return 'progressing';
    } else if (status === 'Solved') {
      return 'solved';
    }
    return '';
  }

}
