import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-witness',
  templateUrl: './witness.page.html',
  styleUrls: ['./witness.page.scss'],
})
export class WitnessPage implements OnInit {
  selectedSegment: string = 'witness';
  
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSegmentChange(event: any){
    const segmentValue = event.detail.value;
    if(segmentValue === 'register'){
      this.router.navigate(['/register']);
    }
    else if(segmentValue === 'witness'){
      this.router.navigate(['/witness']);
    }
  }

}
