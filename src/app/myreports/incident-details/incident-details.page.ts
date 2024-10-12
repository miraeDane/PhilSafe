import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CitizenService } from 'src/app/services/citizen.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-incident-details',
  templateUrl: './incident-details.page.html',
  styleUrls: ['./incident-details.page.scss'],
})
export class IncidentDetailsPage implements OnInit, OnDestroy {

  report: any; // To hold the report details
  private refreshSubscription: Subscription | undefined;
  citizenId: string | null = null; 
  reports: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private loadingService: LoadingService,
    private citizenService: CitizenService,
  ) { }

 
  ngOnInit() {
    this.loadCitizenReports();
    this.loadCitizenId();
    this.checkUserDataAndLoadReports();
    this.loadReportDetails();
    this.loadCitizenReports();

    

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
            this.loadCitizenReports(); // Load reports after getting citizen ID
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
          console.log('CitizenID in reports', this.citizenId);
          console.log('Reports retrieved:', reports);
          this.loadReportDetails(); // Load specific report details
        },
        (error) => {
          console.error('Error retrieving reports:', error);
          console.log('CitizenID in reports', this.citizenId);
        }
      );
    } else {
      console.log('No citizenId available to load reports.');
    }
  }

  loadReportDetails() {
    const reportId = this.route.snapshot.queryParamMap.get('reportId'); // Get reportId from query params
    if (reportId) {
      this.report = this.reports.find(report => report.reportId === reportId); // Find the specific report
      if (this.report) {
        console.log('Report details loaded:', this.report);
      } else {
        console.warn('Report not found for reportId:', reportId);
      }
    } else {
      console.warn('No reportId provided in query parameters.');
    }
  }

}