import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportAsPage } from './report-as.page';

const routes: Routes = [
  {
    path: '',
    component: ReportAsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportAsPageRoutingModule {}
