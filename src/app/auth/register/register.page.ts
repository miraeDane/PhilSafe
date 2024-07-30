import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
 selectedSegment: string ='register';

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
