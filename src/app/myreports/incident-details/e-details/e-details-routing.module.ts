import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EDetailsPage } from './e-details.page';

const routes: Routes = [
  {
    path: '',
    component: EDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EDetailsPageRoutingModule {}
