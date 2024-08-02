import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home', 
        pathMatch: 'full'
      },

      {
        path: 'home', 
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),      
      },
      {
        path: 'inbox',
        loadChildren: () => import('../inbox/inbox.module').then(m => m.InboxPageModule)
      },
      {
        path: 'report',
        loadChildren: () => import('../report/report.module').then(m => m.ReportPageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
      },
      {
        path: 'article',
        loadChildren: () => import('../article/article.module').then(m => m.ArticlePageModule)
      },
      {
        path: 'myreports',
        loadChildren: () => import('../myreports/myreports.module').then( m => m.MyreportsPageModule)
      },
      {
        path: 'incident-details/:id',
        loadChildren: () => import('../myreports/incident-details/incident-details.module').then( m => m.IncidentDetailsPageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then( m => m.NotificationPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }