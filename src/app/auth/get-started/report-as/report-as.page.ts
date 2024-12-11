import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-report-as',
  templateUrl: './report-as.page.html',
  styleUrls: ['./report-as.page.scss'],
})
export class ReportAsPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  selectedSegment: string = '1';
  reporterType: string = '';
  isModalOpen: boolean = false;

  ngOnInit() {
    
  }


  onReporterSelect(type: string) {
    this.reporterType = type; // Store the reporter type if needed later
    this.isModalOpen = true; // Open the modal
    console.log(type); // Log the reporter type
    
  }

  
closeModal() {
  this.isModalOpen = false; 
}

goBack() {
  this.closeModal(); 
  setTimeout(() => {
    this.router.navigate(['/tabs/home']);
  }, 100);
}

proceedToReport() {
  this.closeModal(); // Close the modal
  this.router.navigate(['/report/1'], { queryParams: { reporterType: this.reporterType } }); // Navigate with query params
}
 
}

