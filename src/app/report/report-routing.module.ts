import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportPage } from './report.page';

const routes: Routes = [
  {
    path: '',
    component: ReportPage
  },
  {
    path: ':segment',
    component: ReportPage
  },  {
    path: 'add-witness',
    loadChildren: () => import('./add-witness/add-witness.module').then( m => m.AddWitnessPageModule)
  },
  {
    path: 'add-evidence',
    loadChildren: () => import('./add-evidence/add-evidence.module').then( m => m.AddEvidencePageModule)
  },
  {
    path: 'add-suspect',
    loadChildren: () => import('./add-suspect/add-suspect.module').then( m => m.AddSuspectPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportPageRoutingModule {}
