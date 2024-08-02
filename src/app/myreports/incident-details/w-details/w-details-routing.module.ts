import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WDetailsPage } from './w-details.page';

const routes: Routes = [
  {
    path: '',
    component: WDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WDetailsPageRoutingModule {}
