import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'aprender', pathMatch: 'full' },
      {
        path: 'aprender',
        loadComponent: () => import('./pages/dashboard/tabs/aprender/aprender').then((m) => m.Aprender),
      },
      {
        path: 'retos',
        loadComponent: () => import('./pages/dashboard/tabs/retos/retos').then((m) => m.Retos),
      },
      {
        path: 'ranking',
        loadComponent: () => import('./pages/dashboard/tabs/ranking/ranking').then((m) => m.Ranking),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/dashboard/tabs/perfil/perfil').then((m) => m.Perfil),
      },
      {
        path: 'quiz/:lessonId',
        loadComponent: () => import('./pages/dashboard/tabs/quiz/quiz').then((m) => m.Quiz),
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
