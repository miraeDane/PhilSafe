import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountRegistrationPage } from './account-registration.page';

const routes: Routes = [
  {
    path: '',
    component: AccountRegistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRegistrationPageRoutingModule {}
