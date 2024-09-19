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

  ngOnInit() {
    
  }


  onReporterSelect(type: string) {
    this.router.navigate(['/report/1'], { queryParams: { reporterType: type } });
    console.log(type)
    
  }
  
 
}

