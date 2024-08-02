import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EDetailsPageRoutingModule } from './e-details-routing.module';

import { EDetailsPage } from './e-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EDetailsPageRoutingModule
  ],
  declarations: [EDetailsPage]
})
export class EDetailsPageModule {}
