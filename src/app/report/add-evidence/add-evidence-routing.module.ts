import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEvidencePage } from './add-evidence.page';

const routes: Routes = [
  {
    path: '',
    component: AddEvidencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEvidencePageRoutingModule {}
