import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

export const routes: RouteDefinition[] = [
  {
    path: '/', // Ensure this path is all lowercase
    component: lazy(() => import('./homepage')), // Ensure the path matches the file name
  },

  {
    path: '/login', // Ensure this path is all lowercase
    component: lazy(() => import('./login')), // Ensure the path matches the file name
  },

  {
    path: '/register', // Ensure this path is all lowercase
    component: lazy(() => import('./register')), // Ensure the path matches the file name
  },

  {
    path: '/aktivasi', // Ensure this path is all lowercase
    component: lazy(() => import('./aktivasi')), // Ensure the path matches the file name
  },

  {
    path: '/lupapassword', // Ensure this path is all lowercase
    component: lazy(() => import('./lupapassword')), // Ensure the path matches the file name
  },

  {
    path: '/dashboard', // Ensure this path is all lowercase
    component: lazy(() => import('./dashboard')), // Ensure the path matches the file name
  },

  {
    path: '/petalokasi', // Ensure this path is all lowercase
    component: lazy(() => import('./petaLokasi')), // Ensure the path matches the file name
  },

  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];