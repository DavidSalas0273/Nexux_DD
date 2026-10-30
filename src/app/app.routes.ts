import { Routes } from '@angular/router';
import { authGuard, publicGuard, levelSelectedGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirige la raíz al login
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // ── Módulo de autenticación (rutas públicas) ─────────────────────────────────
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.RegisterComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  // ── Onboarding — requiere sesión, no requiere nivel previo ───────────────────
  {
    path: 'onboarding',
    canActivate: [authGuard],
    children: [
      {
        path: 'nivel',
        loadComponent: () =>
          import('./features/onboarding/cooking-level/cooking-level').then(
            (m) => m.CookingLevelComponent
          ),
      },
      {
        path: '',
        redirectTo: 'nivel',
        pathMatch: 'full',
      },
    ],
  },

  // ── Rutas protegidas — requieren sesión y nivel de cocina seleccionado ────────
  {
    path: 'dashboard',
    canActivate: [levelSelectedGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
  },

  {
    path: 'aprender',
    canActivate: [levelSelectedGuard],
    loadComponent: () =>
      import('./features/learn/learn').then((m) => m.LearnComponent),
  },

  {
    path: 'cursos',
    canActivate: [levelSelectedGuard],
    loadComponent: () =>
      import('./features/learn/course-preview/course-preview').then(
        (m) => m.CoursePreviewComponent
      ),
  },

  {
    path: 'perfil',
    canActivate: [levelSelectedGuard],
    loadComponent: () =>
      import('./features/profile/profile').then((m) => m.ProfileComponent),
  },

  {
    path: 'perfil/editar',
    canActivate: [levelSelectedGuard],
    loadComponent: () =>
      import('./features/profile/edit-profile/edit-profile').then(
        (m) => m.EditProfileComponent
      ),
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
