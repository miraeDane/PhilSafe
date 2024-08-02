import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myreports',
  templateUrl: './myreports.page.html',
  styleUrls: ['./myreports.page.scss'],
})
export class MyreportsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  incidents = [
    { crime_id:'1',type: 'Rape', status: 'Reviewing', progress: 0.2 },
    { crime_id:'2',type: 'Assault', status: 'Progressing', progress: 0.5 },
    { crime_id:'3',type: 'Robbery', status: 'Solved', progress: 1.0 }
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

  goToDetails(crime_id: string) {
    this.router.navigate(['/incident-details', crime_id]);
  }

}
