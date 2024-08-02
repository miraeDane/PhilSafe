import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WDetailsPageRoutingModule } from './w-details-routing.module';

import { WDetailsPage } from './w-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WDetailsPageRoutingModule
  ],
  declarations: [WDetailsPage]
})
export class WDetailsPageModule {}
