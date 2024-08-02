import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SDetailsPage } from './s-details.page';

const routes: Routes = [
  {
    path: '',
    component: SDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SDetailsPageRoutingModule {}
