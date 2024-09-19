import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentDetailsPage } from './incident-details.page';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: IncidentDetailsPage,
    
  },
  {
    path: 'w-details',
    loadChildren: () => import('./w-details/w-details.module').then( m => m.WDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'e-details',
    loadChildren: () => import('./e-details/e-details.module').then( m => m.EDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 's-details',
    loadChildren: () => import('./s-details/s-details.module').then( m => m.SDetailsPageModule),
    canActivate: [AuthGuard],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentDetailsPageRoutingModule {}
