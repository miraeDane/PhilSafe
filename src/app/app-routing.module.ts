import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

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
    path: 'tabs/home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    
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
    loadChildren: () => import('./myreports/incident-details/incident-details.module').then( m => m.IncidentDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'carousel',
    loadChildren: () => import('./auth/get-started/carousel/carousel.module').then(m => m.CarouselPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'w-details',
    loadChildren: () => import('./myreports/incident-details/w-details/w-details.module').then( m => m.WDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'e-details',
    loadChildren: () => import('./myreports/incident-details/e-details/e-details.module').then( m => m.EDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 's-details',
    loadChildren: () => import('./myreports/incident-details/s-details/s-details.module').then( m => m.SDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-evidence',
    loadChildren: () => import('./report/add-evidence/add-evidence.module').then( m => m.AddEvidencePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-suspect',
    loadChildren: () => import('./report/add-suspect/add-suspect.module').then( m => m.AddSuspectPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-witness',
    loadChildren: () => import('./report/add-witness/add-witness.module').then( m => m.AddWitnessPageModule),
    canActivate: [AuthGuard],
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
