import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEvidencePage } from './add-evidence.page';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AddEvidencePage
  },
  {
    path: 'add-evidence',
    loadChildren: () => import('./add-evidence.module').then( m => m.AddEvidencePageModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEvidencePageRoutingModule {}
