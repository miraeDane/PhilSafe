import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEvidencePageRoutingModule } from './add-evidence-routing.module';

import { AddEvidencePage } from './add-evidence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEvidencePageRoutingModule
  ],
  declarations: [AddEvidencePage]
})
export class AddEvidencePageModule {}
