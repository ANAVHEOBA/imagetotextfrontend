import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RegisterComponent } from './pages/register/register';
import { VerifyEmailComponent } from './pages/verify-email/verify-email';
import { LoginComponent } from './pages/login/login';
import { DashboardLayout } from './dashboard/layouts/dashboard-layout/dashboard-layout';
import { OverviewComponent } from './dashboard/pages/overview/overview';
import { History } from './dashboard/pages/history/history';
import { Billing } from './dashboard/pages/billing/billing';
import { Settings } from './dashboard/pages/settings/settings';
import { ConvertComponent } from './dashboard/pages/convert/convert';
import { ProjectsPage } from './dashboard/pages/projects/projects';
import { ProjectDetailsPage } from './dashboard/pages/project-details/project-details';
import { RenderMode } from '@angular/ssr';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'convert', component: ConvertComponent },
      { path: 'history', component: History },
      { path: 'billing', component: Billing },
      { path: 'settings', component: Settings },
      { path: 'projects', component: ProjectsPage },
      { 
        path: 'projects/:id', 
        component: ProjectDetailsPage
      }
    ]
  }
];