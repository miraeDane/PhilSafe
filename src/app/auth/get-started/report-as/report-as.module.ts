import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportAsPageRoutingModule } from './report-as-routing.module';

import { ReportAsPage } from './report-as.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportAsPageRoutingModule
  ],
  declarations: [ReportAsPage]
})
export class ReportAsPageModule {}
