import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SDetailsPageRoutingModule } from './s-details-routing.module';

import { SDetailsPage } from './s-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SDetailsPageRoutingModule
  ],
  declarations: [SDetailsPage]
})
export class SDetailsPageModule {}
