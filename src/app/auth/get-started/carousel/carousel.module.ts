import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicSlides } from '@ionic/angular';

import { CarouselPageRoutingModule } from './carousel-routing.module';

import { CarouselPage } from './carousel.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarouselPageRoutingModule,

  ],
  declarations: [CarouselPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarouselPageModule {}
