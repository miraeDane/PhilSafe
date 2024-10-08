import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../services/report.service';
import { CitizenService } from '../services/citizen.service';

@Component({
  selector: 'app-myreports',
  templateUrl: './myreports.page.html',
  styleUrls: ['./myreports.page.scss'],
})
export class MyreportsPage implements OnInit {

  incidents: any[] = []; 
  citizenId: string | null = null; 

  constructor(
    private router: Router,
    private reportService: ReportService,
    private citizenService: CitizenService 
  
  ) { }

  ngOnInit() {
    this.loadCitizenReports();
    this.loadCitizenId();
  }

  loadCitizenId() {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const { personId } = JSON.parse(userData);
      this.citizenService.getCitizens().subscribe(
        (citizens) => {
          const citizen = citizens.find((c: { person_id: any }) => c.person_id === personId);
          if (citizen) {
            this.citizenId = citizen.citizen_id; 
            console.log('Retrieved citizenId:', this.citizenId);
            this.loadCitizenReports();
          } else {
            console.error('Citizen not found for personId:', personId);
          }
        },
        (error) => {
          console.error('Error retrieving citizens:', error);
        }
      );
    }
  }

  loadCitizenReports() {
    if (this.citizenId) {
      this.reportService.getReports().subscribe(
        (reports) => {
          this.incidents = reports; // Store the reports
          console.log('CitizenID in reports', this.citizenId)
          console.log('Reports retrieved:', reports);
        },
        (error) => {
          console.error('Error retrieving reports:', error);
          console.log('CitizenID in reports', this.citizenId)
        }
      );
    } else {
      console.warn('No citizenId available to load reports.');
      //console.log('CitizenID in reports', this.citizenId)
    }
  }

  // incidents = [
  //   { crime_id:'1',type: 'Rape', status: 'Reviewing', progress: 0.2 },
  //   { crime_id:'2',type: 'Assault', status: 'Progressing', progress: 0.5 },
  //   { crime_id:'3',type: 'Robbery', status: 'Solved', progress: 1.0 }
  // ];
  
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
