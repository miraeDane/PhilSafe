import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SuspectCommon } from 'src/app/models/2suspect.model';
import { NavigationState } from 'src/app/models/navstate.model';
import { Suspect } from 'src/app/models/suspect';

@Component({
  selector: 'app-s-details',
  templateUrl: './s-details.page.html',
  styleUrls: ['./s-details.page.scss'],
})
export class SDetailsPage implements OnInit {

  // newSuspect: Suspect | null = null;
  suspects: Suspect[] = [];
  

  constructor(private router: Router) { }

  ngOnInit() {
   
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as NavigationState; 
    if (state?.newSuspect) {
      this.addSuspect(state.newSuspect); 
    }
  }


  addSuspect(newSuspect: Suspect) {
    this.suspects.push(newSuspect);
  }

  
  navigateToAddSuspect() {
    this.router.navigate(['/add-suspect'], {
      state: { returnPage: '/s-details' } 
    });
  }
}
