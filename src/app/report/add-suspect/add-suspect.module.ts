import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSuspectPageRoutingModule } from './add-suspect-routing.module';

import { AddSuspectPage } from './add-suspect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSuspectPageRoutingModule
  ],
  declarations: [AddSuspectPage]
})
export class AddSuspectPageModule {}
