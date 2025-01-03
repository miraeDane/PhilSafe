import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { SmtpService } from '../services/smtp.service';
import { Router } from '@angular/router';
import { ReportService } from '../services/report.service';
import { JurisdictionService } from '../services/jurisdiction.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
})
export class PaymentSuccessPage implements OnInit {

  transactionId: number = 0;
  reportId: number = 0;
  citizenId: number = 0;
  transactionDetails: any;
  reportData: any;
  stationData: any;


  constructor(
    private transactionService: TransactionService,
    private smtpService: SmtpService,
    private router: Router,
    private reportService: ReportService,
    private stationService: JurisdictionService
  ) { }

  ngOnInit() {

    const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { citizenId: number; reportId: number; trans_id: number };

        if (state) {
          console.log('Citizen ID:', state.citizenId);
          console.log('Report ID:', state.reportId);
          console.log('Transaction ID:', state.trans_id);

          this.citizenId = state.citizenId;
          this.reportId = state.reportId;
          this.transactionId = state.trans_id;
          this.fetchTransaction();

          this.reportService.getReports(this.citizenId).subscribe(
            (response) => {
              const report = response.find((r: any) => r.report_id === this.reportId)
              this.reportData = report;
              console.log("Report Fetched from citizen", this.reportData)
              if(this.reportData)
                this.stationService.getStation(this.reportData.jurisdiction_id).subscribe(
                  (response) => {
                    console.log("Station Data Retrieved", response)
                      this.stationData = response;
                      console.log('Station Data', response)
                  },
                  (error) => {
                    console.error("Error fetching Station Data", error)
                  }
                )

            },
            (error) => {
              console.error("Error fetching citizen reports")
            }
          )
        }
  }


  fetchTransaction() {
    this.transactionService.collectReportReceipt(this.reportId).subscribe({
      next: (response) => {
        console.log('Fetched Transaction:', response);
        this.transactionDetails = response;
      },
      error: (error) => {
        console.error('Error retrieving transaction:', error);
      },
    });
  }  
  



  retrieveReceipt() {
    
    if(this.reportId && this.citizenId) {
      this.smtpService.retrieveReceipt(this.reportId, this.citizenId).subscribe({
        next: (response: any) => {
          console.log('Receipt retrieved successfully:', response);
        },
        error: (error: any) => {
          console.error('Error retrieving receipt:', error);
        },
      });
    }  
  }

}
    


