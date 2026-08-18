import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/admin/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'comentarios' },
      {
        path: 'comentarios',
        loadComponent: () => import('./features/admin/comments/comments-list/comments-list').then((m) => m.CommentsList),
      },
      {
        path: 'perfiles',
        loadComponent: () => import('./features/admin/profiles/profiles-list/profiles-list').then((m) => m.ProfilesList),
      },
      {
        path: 'perfiles/nuevo',
        loadComponent: () => import('./features/admin/profiles/profile-form/profile-form').then((m) => m.ProfileForm),
      },
      {
        path: 'perfiles/:id',
        loadComponent: () => import('./features/admin/profiles/profile-form/profile-form').then((m) => m.ProfileForm),
      },
      {
        path: 'ciudades',
        loadComponent: () => import('./features/admin/cities/cities-list/cities-list').then((m) => m.CitiesList),
      },
      {
        path: 'departamentos',
        loadComponent: () =>
          import('./features/admin/departments/departments-list/departments-list').then((m) => m.DepartmentsList),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/admin/users/users-list/users-list').then((m) => m.UsersList),
      },
    ],
  },
  { path: '**', redirectTo: 'admin' },
];
