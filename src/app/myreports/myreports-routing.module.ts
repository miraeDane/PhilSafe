import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyreportsPage } from './myreports.page';

const routes: Routes = [
  {
    path: '',
    component: MyreportsPage
  },
  {
    path: 'incident-details',
    loadChildren: () => import('./incident-details/incident-details.module').then( m => m.IncidentDetailsPageModule)
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyreportsPageRoutingModule {}
