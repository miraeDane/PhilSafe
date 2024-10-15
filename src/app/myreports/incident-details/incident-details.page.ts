import { HttpClient } from '@angular/common/http';
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
  policeStations: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private loadingService: LoadingService,
    private citizenService: CitizenService,
    private http: HttpClient
  ) { }

 
  ngOnInit() {

    // this.loadCitizenId();
    // this.loadCitizenReports();
    // this.loadReportDetails();
    this.loadPoliceStations().then(() => {
      this.checkUserDataAndLoadReports();
    });
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
          const reportId = this.route.snapshot.queryParamMap.get('reportId');
          if (reportId) {
            const foundReport = reports.find((report: any) => String(report.report_id) === String(reportId));
            if (foundReport) {
              const stationName = this.getStationName(foundReport.jurisdiction_id);
              this.report = {
                report_id: foundReport.report_id,
                subcategory_name: foundReport.subcategory_name,
                category_name: foundReport.category_name,
                incident_date: foundReport.incident_date,
                jurisdiction_name: stationName,
                report_body: foundReport.report_body,
                e_signature: foundReport.e_signature,
              };
              console.log('Mapped report details:', this.report);
              console.log("Station Name:", stationName)
            }
          }
        },
        (error) => {
          console.error('Error retrieving reports:', error);
        }
      );
    }
  }

  loadPoliceStations(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.http.get<any[]>('assets/location/jurisdiction1.json').subscribe(
            (data) => {
                this.policeStations = data; 
                console.log('Loaded police stations:', this.policeStations);
                resolve(); // Resolve when data is loaded
            },
            (error) => {
                console.error('Error loading police stations:', error);
                resolve(); // Resolve even on error to avoid blocking
            }
        );
    });
  
  }
  
  
  getStationName(jurisdiction_id: number): string {
    const station = this.policeStations.find(station => {
      console.log('Comparing jurisdiction_id:', jurisdiction_id, 'with station:', station.stationId);
      return station.stationId === jurisdiction_id;
    });
    return station ? station.stationName : 'Unknown Station';
  }
  
  
  
  loadReportDetails() {
    const reportId = this.route.snapshot.queryParamMap.get('reportId');
    console.log('Looking for reportId:', reportId);
    console.log('Available reports:', this.reports);
  
    if (reportId) {
      if (this.reports.length > 0) {
        this.report = this.reports.find(report => String(report.reportId) === String(reportId));
        if (this.report) {
          console.log('Report details loaded:', this.report);
        } else {
          console.warn('Report not found for reportId:', reportId);
        }
      } else {
        console.warn('Reports have not been loaded yet.');
      }
    } else {
      console.warn('No reportId provided in query parameters.');
    }
  }
  

}