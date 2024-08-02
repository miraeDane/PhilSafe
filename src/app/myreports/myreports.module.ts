import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyreportsPageRoutingModule } from './myreports-routing.module';

import { MyreportsPage } from './myreports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyreportsPageRoutingModule
  ],
  declarations: [MyreportsPage]
})
export class MyreportsPageModule {}
