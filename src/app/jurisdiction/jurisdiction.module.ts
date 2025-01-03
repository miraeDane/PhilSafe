import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JurisdictionPageRoutingModule } from './jurisdiction-routing.module';

import { JurisdictionPage } from './jurisdiction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JurisdictionPageRoutingModule
  ],
  declarations: [JurisdictionPage]
})
export class JurisdictionPageModule {}
