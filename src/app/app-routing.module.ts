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
      import('./tabs/tabs.module').then((m) => m.TabsPageModule), 
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },

  {
    path: 'inbox',
    loadChildren: () =>
      import('./inbox/inbox.module').then((m) => m.InboxPageModule),
  },
  {
    path: 'report/:segment',
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

 
  {
    path: 'myreports',
    loadChildren: () => import('./myreports/myreports.module').then( m => m.MyreportsPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  
  {
    path: 'incident-details/:id',
    loadChildren: () => import('./myreports/incident-details/incident-details.module').then( m => m.IncidentDetailsPageModule)
  },
  {
    path: 'carousel',
    loadChildren: () => import('./auth/get-started/carousel/carousel.module').then(m => m.CarouselPageModule)
  },
  {
    path: 'w-details',
    loadChildren: () => import('./myreports/incident-details/w-details/w-details.module').then( m => m.WDetailsPageModule)
  },
  {
    path: 'e-details',
    loadChildren: () => import('./myreports/incident-details/e-details/e-details.module').then( m => m.EDetailsPageModule)
  },
  {
    path: 's-details',
    loadChildren: () => import('./myreports/incident-details/s-details/s-details.module').then( m => m.SDetailsPageModule)
  },
  {
    path: 'add-evidence',
    loadChildren: () => import('./report/add-evidence/add-evidence.module').then( m => m.AddEvidencePageModule)
  },
  {
    path: 'add-suspect',
    loadChildren: () => import('./report/add-suspect/add-suspect.module').then( m => m.AddSuspectPageModule)
  },
  {
    path: 'add-witness',
    loadChildren: () => import('./report/add-witness/add-witness.module').then( m => m.AddWitnessPageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./auth/create-account/create-account.module').then(m => m.CreateAccountPageModule)
  },
  {
    path: 'account-registration',
    loadChildren: () => import('./auth/account-registration/account-registration.module').then(m => m.AccountRegistrationPageModule)
  }
  // {
  //   path: 'report/:segment',
  //   loadChildren: () => import('./report/report.module').then(m => m.ReportPageModule)
  // },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
