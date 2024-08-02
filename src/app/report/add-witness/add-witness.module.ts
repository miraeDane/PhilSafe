import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddWitnessPageRoutingModule } from './add-witness-routing.module';

import { AddWitnessPage } from './add-witness.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddWitnessPageRoutingModule
  ],
  declarations: [AddWitnessPage]
})
export class AddWitnessPageModule {}
