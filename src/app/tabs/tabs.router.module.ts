// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { TabsPage } from './tabs.page';
// import { IonicModule } from '@ionic/angular';

// const routes: Routes = [
//     {
//       path: 'tabs',
//       component: TabsPage,
//       children: [
//           {
//               path: '',
//               redirectTo: 'home', // Redirect to home tab
//               pathMatch: 'full'
//           },
//           {
//               path: 'home', // Home tab
//               loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) // Adjust path as necessary
//           },
//           {
//               path: 'inbox',
//               loadChildren: () => import('../inbox/inbox.module').then(m => m.InboxPageModule)
//           },
//           {
//               path: 'report',
//               loadChildren: () => import('../report/report.module').then(m => m.ReportPageModule)
//           },
//           {
//               path: 'map',
//               loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
//           },
//           {
//               path: 'article',
//               loadChildren: () => import('../article/article.module').then(m => m.ArticlePageModule)
//           },
//       ]
//   }];

// @NgModule({
//   imports: [
//     IonicModule,
//     RouterModule.forChild(routes)
//   ],
//   exports: [RouterModule]
// })
// export class TabsPageRoutingModule {}
