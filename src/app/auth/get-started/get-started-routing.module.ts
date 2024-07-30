import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetStartedPage } from './get-started.page';

const routes: Routes = [
  {
    path: '',
    component: GetStartedPage
  },  {
    path: 'carousel',
    loadChildren: () => import('./carousel/carousel.module').then( m => m.CarouselPageModule)
  },
  {
    path: 'report-as',
    loadChildren: () => import('./report-as/report-as.module').then( m => m.ReportAsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetStartedPageRoutingModule {}
