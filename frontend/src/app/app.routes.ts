import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Trackr.jobs — international tech jobs',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./pages/job-detail/job-detail').then((m) => m.JobDetail),
  },
  {
    path: 'bookmarks',
    title: 'Bookmarks — Trackr.jobs',
    loadComponent: () => import('./pages/bookmarks/bookmarks').then((m) => m.Bookmarks),
  },
  {
    path: 'remote',
    title: 'Remote — Trackr.jobs',
    loadComponent: () => import('./pages/remote/remote').then((m) => m.Remote),
  },
  {
    path: 'companies',
    title: 'Target companies — Trackr.jobs',
    loadComponent: () => import('./pages/companies/companies').then((m) => m.Companies),
  },
  {
    path: 'visa-sponsors',
    title: 'Visa sponsors — Trackr.jobs',
    loadComponent: () => import('./pages/visa-sponsors/visa-sponsors').then((m) => m.VisaSponsors),
  },
  {
    path: 'job-platforms',
    title: 'Job platforms — Trackr.jobs',
    loadComponent: () => import('./pages/job-platforms/job-platforms').then((m) => m.JobPlatforms),
  },
  {
    path: 'settings',
    title: 'Settings — Trackr.jobs',
    loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
  },
  {
    path: 'information',
    title: 'Information — Trackr.jobs',
    loadComponent: () => import('./pages/information/information').then((m) => m.Information),
  },
  { path: '**', redirectTo: '' },
];
