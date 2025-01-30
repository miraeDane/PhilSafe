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
  status: string = 'Report Accepted';
  progress: any;
  statusLabel: string = '';
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
          this.reports = reports; 
          console.log('CitizenID in reports', this.citizenId)
          console.log('Reports retrieved:', this.reports);
          
          this.reports.forEach((report) => {
            this.getStatus(report); 
          });
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

  
  getProgress(){

    if(status === 'Report Accepted'){
      this.progress = 0.5;
      
    } 
  }
  

  // incident: any = {
  //   crime_id: this.crimeID,
  //   status: this.status, 
  //   progress: this.progress 
  // }

  
  
  // getStatusClass(status: string): string {
  //   if (status === 'Report Accepted') {
  //     return 'progressing';
  //   } else if (status === 'Progressing') {
  //     return 'progressing';
  //   } else if (status === 'Solved') {
  //     return 'solved';
  //   }
  //   return '';
  // }


  // getStatus(report: any){

  //   // console.log('Report object:', report);
  //   if(report.report_id && !report.crime_id){
  //     // console.log('Report Accepted for report ID:', report.report_id);
  //     this.statusLabel = 'Report Accepted',
  //     this.progress = 0.5
  //     this.status = 'progressing'
  //   } else if (report.report_id && report.crime_id) {
  //     console.log('Case Filed for report ID:', report.report_id);
  //     this.statusLabel = 'Case Filed',
  //     this.progress = 1.0
  //     this.status = 'solved'
  //   }
  // }

  getStatus(report: any) {
    if (report.report_id && !report.crime_id) {
      console.log('Report Accepted for report ID:', report.report_id);
      report.statusLabel = 'Report Accepted';
      report.progress = 0.5;
      report.status = 'progressing';
    } else if (report.crime_id) {
      console.log('Case Filed for report ID:', report.report_id);
      report.statusLabel = 'Case Filed';
      report.progress = 1.0;
      report.status = 'solved';
    }
  }
  

  goToDetails(reportId: string) {
    this.router.navigate(['/incident-details'], { queryParams: { reportId } });
    //this.router.navigate(['/incident-details', reportId]);
  }
  
}
