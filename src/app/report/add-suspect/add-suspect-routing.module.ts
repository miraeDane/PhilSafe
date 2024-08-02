import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSuspectPage } from './add-suspect.page';

const routes: Routes = [
  {
    path: '',
    component: AddSuspectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSuspectPageRoutingModule {}
