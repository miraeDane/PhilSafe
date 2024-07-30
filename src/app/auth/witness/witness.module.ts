import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WitnessPageRoutingModule } from './witness-routing.module';

import { WitnessPage } from './witness.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WitnessPageRoutingModule
  ],
  declarations: [WitnessPage]
})
export class WitnessPageModule {}
