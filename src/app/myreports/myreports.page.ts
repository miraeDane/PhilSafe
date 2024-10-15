import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../services/report.service';
import { CitizenService } from '../services/citizen.service';
import { Report } from '../models/report';
import { Subscription } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-myreports',
  templateUrl: './myreports.page.html',
  styleUrls: ['./myreports.page.scss'],
})
export class MyreportsPage implements OnInit {

  incidents: any[] = []; 
  citizenId: string | null = null; 
  reports: any[] = [];
  crimeID: number = 1;
  status: string = 'Reviewing';
  progress: any = 0.2;
  private refreshSubscription: Subscription | undefined;




  constructor(
    private router: Router,
    private reportService: ReportService,
    private citizenService: CitizenService,
    private loadingService: LoadingService 
  
  ) { }

  ngOnInit() {
    this.loadCitizenReports();
    this.loadCitizenId();
    this.checkUserDataAndLoadReports();

    this.refreshSubscription = this.loadingService.refresh$.subscribe(() => {
      this.checkUserDataAndLoadReports();
    });
    
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  checkUserDataAndLoadReports() {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      this.loadCitizenId();
    } else {
      console.warn('No userData found in session storage. Please log in.');
    }
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
      this.reportService.getReports(this.citizenId).subscribe(
        (reports) => {
          this.reports = reports; // Store the reports
          this.reports
          console.log('CitizenID in reports', this.citizenId)
          console.log('Reports retrieved:', reports);
        },
        (error) => {
          console.error('Error retrieving reports:', error);
          console.log('CitizenID in reports', this.citizenId)
        }
      );
    } else {
      console.log('No citizenId available to load reports.');
      //console.log('CitizenID in reports', this.citizenId)
    }
  }

  

  incident: any = {
    crime_id: this.crimeID,
    status: this.status, 
    progress: this.progress 
  }
  
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

  goToDetails(reportId: string) {
    this.router.navigate(['/incident-details'], { queryParams: { reportId } });
    //this.router.navigate(['/incident-details', reportId]);
  }
  
}
