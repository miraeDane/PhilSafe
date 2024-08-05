import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Swiper} from "swiper";
import { SwiperOptions } from 'swiper/types';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.page.html',
  styleUrls: ['./carousel.page.scss'],
})
export class CarouselPage implements OnInit  {
 


  private slideInterval: any;
  currentSlideIndex: number = 0;

  slidesImages = [
    {image: 'assets/1-getstarted.png'},
    {image: 'assets/2-getstarted.png'},
    {image: 'assets/3-getstarted.png'}
  ];
  slidesContent = [
    {
     
      title: 'Ease Reporting',
      description: 'Easily report incidents, upload evidence, and ensuring your report reach the right authorities.',
      button: 'Next'
    },
    {
     
      title: 'Community Impact',
      description: 'Join a community dedicated to safety and justice. Your reports help make neighborhoods safer for everyone.',
      button: 'Next'
    },
    {
     
      title: 'Collaborate with Authorities',
      description: 'Work hand-in-hand with local law enforcement to help resolve crimes faster and more efficiently.',
      button: "Let's get started",
      login: "Already have an account?",
      login_button: "Sign In",
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

 
 
  swiperSlideChanged(event: any) {
   console.log("Slide changed",event)
  }

  getStarted(){
    if (this.currentSlideIndex < this.slidesContent.length - 1) {
      this.currentSlideIndex++;
    } else {
      this.router.navigate(['../../create-account']);
    }
  }

  
}
