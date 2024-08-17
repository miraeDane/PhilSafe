import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountRegistrationPageRoutingModule } from './account-registration-routing.module';

import { AccountRegistrationPage } from './account-registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountRegistrationPageRoutingModule
  ],
  declarations: [AccountRegistrationPage]
})
export class AccountRegistrationPageModule {}
