import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./page/login/login').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./page/pagina/pagina').then((m) => m.InicioComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./page/usuarios/usuarios').then((m) => m.UsuariosComponent),
      },
      {
        path: 'roles',
        loadComponent: () => import('./page/roles/roles').then((m) => m.RolesComponent),
      },
      {
        path: 'permisos',
        loadComponent: () => import('./page/permisos/permisos').then((m) => m.PermisosComponent),
      },
      {
        path: 'negocio',
        loadComponent: () => import('./page/negocio/negocio').then((m) => m.NegocioComponent),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./page/perfil/perfil').then((m) => m.PerfilComponent),
      },
      { path: '', redirectTo: 'incio', pathMatch: 'full' },
    ],
  },
  {path:'*', redirectTo:'login'}
];
