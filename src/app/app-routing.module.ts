import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'get-started', 
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    loadChildren: () => import('./auth/get-started/get-started.module').then( m => m.GetStartedPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'report-as',
    loadChildren: () => import('./auth/get-started/report-as/report-as.module').then( m => m.ReportAsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'witness',
    loadChildren: () => import('./auth/witness/witness.module').then( m => m.WitnessPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule), // Ensure this path is correct
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    // children: [
    //   {
    //     path: 'edit-profile',
    //     loadChildren: () =>
    //       import('./home/edit-profile/edit-profile.module').then(
    //         (m) => m.EditProfilePageModule
    //       ),
    //   },
    //   {
    //     path: 'my-reports',
    //     loadChildren: () =>
    //       import('./home/my-reports/my-reports.module').then(
    //         (m) => m.MyReportsPageModule
    //       ),
    //   },
    //   {
    //     path: 'settings',
    //     loadChildren: () =>
    //       import('./home/settings/settings.module').then(
    //         (m) => m.SettingsPageModule
    //       ),
    //   },
    // ],
  },

  {
    path: 'inbox',
    loadChildren: () =>
      import('./inbox/inbox.module').then((m) => m.InboxPageModule),
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./report/report.module').then((m) => m.ReportPageModule),
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then((m) => m.MapPageModule),
  },
  {
    path: 'article',
    loadChildren: () =>
      import('./article/article.module').then((m) => m.ArticlePageModule),
  },
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
