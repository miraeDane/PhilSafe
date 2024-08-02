import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddWitnessPage } from './add-witness.page';

const routes: Routes = [
  {
    path: '',
    component: AddWitnessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddWitnessPageRoutingModule {}
