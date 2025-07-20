import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { GraduateGuard } from './core/guards/graduate.guard';
import { EmployerGuard } from './core/guards/employer.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  {
    path: 'graduate',
    canActivate: [GraduateGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/graduate/dashboard/dashboard.component').then(
            (m) => m.GraduateDashboardComponent
          ),
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/graduate/job-search/job-search.component').then(
            (m) => m.JobSearchComponent
          ),
      },
      {
        path: 'jobs/:id',
        loadComponent: () =>
          import('./features/graduate/job-detail/job-detail.component').then(
            (m) => m.JobDetailComponent
          ),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import(
            './features/graduate/applications/applications.component'
          ).then((m) => m.ApplicationsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/graduate/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },
  {
    path: 'employer',
    canActivate: [EmployerGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/employer/dashboard/dashboard.component').then(
            (m) => m.EmployerDashboardComponent
          ),
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./features/employer/jobs/jobs.component').then(
            (m) => m.EmployerJobsComponent
          ),
      },
      {
        path: 'post-job',
        loadComponent: () =>
          import('./features/employer/post-job/post-job.component').then(
            (m) => m.PostJobComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/employer/profile/profile.component').then(
            (m) => m.EmployerProfileComponent
          ),
      },
      {
        path: 'applicants/:jobId',
        loadComponent: () =>
          import(
            './features/employer/job-applicants/job-applicants.component'
          ).then((m) => m.JobApplicantsComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
