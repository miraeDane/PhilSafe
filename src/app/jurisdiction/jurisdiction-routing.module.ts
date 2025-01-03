import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JurisdictionPage } from './jurisdiction.page';

const routes: Routes = [
  {
    path: '',
    component: JurisdictionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JurisdictionPageRoutingModule {}
