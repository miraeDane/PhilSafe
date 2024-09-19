import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home', 
        pathMatch: 'full'
      },

      {
        path: 'home', 
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
        canActivate: [AuthGuard],      
      },
      {
        path: 'report',
        loadChildren: () => import('../report/report.module').then(m => m.ReportPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'map',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule),
        canActivate: [AuthGuard],
  
      },
      {
        path: 'article',
        loadChildren: () => import('../article/article.module').then(m => m.ArticlePageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'myreports',
        loadChildren: () => import('../myreports/myreports.module').then( m => m.MyreportsPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'incident-details/:id',
        loadChildren: () => import('../myreports/incident-details/incident-details.module').then( m => m.IncidentDetailsPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then( m => m.NotificationPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'report-as',
        loadChildren: () => import('../auth/get-started/report-as/report-as.module').then(m => m.ReportAsPageModule),
        canActivate: [AuthGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }