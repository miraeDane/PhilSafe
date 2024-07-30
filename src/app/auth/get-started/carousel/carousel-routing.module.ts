import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarouselPage } from './carousel.page';

const routes: Routes = [
  {
    path: '',
    component: CarouselPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarouselPageRoutingModule {}
