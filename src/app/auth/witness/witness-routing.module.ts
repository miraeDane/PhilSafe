import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WitnessPage } from './witness.page';

const routes: Routes = [
  {
    path: '',
    component: WitnessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WitnessPageRoutingModule {}
