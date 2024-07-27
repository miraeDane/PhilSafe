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
        redirectTo: 'home', // Redirect to home tab
        pathMatch: 'full'
      },
      {
        path: 'home', // Home tab
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
        // children: [
        //   {
        //     path: 'edit-profile',
        //     loadChildren: () =>
        //       import('../home/edit-profile/edit-profile.module').then(
        //         (m) => m.EditProfilePageModule
        //       ),
        //   },
        //   {
        //     path: 'my-reports',
        //     loadChildren: () =>
        //       import('../home/my-reports/my-reports.module').then(
        //         (m) => m.MyReportsPageModule
        //       ),
        //   },
        //   {
        //     path: 'settings',
        //     loadChildren: () =>
        //       import('../home/settings/settings.module').then(
        //         (m) => m.SettingsPageModule
        //       ),
        //   },
        // ],
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }