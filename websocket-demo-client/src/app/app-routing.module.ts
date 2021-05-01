import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportPage} from './pages/report-page/report.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'report',
    pathMatch: 'full'
  },
  {
    path: 'report',
    component: ReportPage
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
