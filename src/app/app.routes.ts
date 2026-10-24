import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/features/home/home.component').then((file) => file.HomeComponent),
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('../app/features/auth/auth.component').then((file) => file.AuthComponent),
  },
  {
    path: 'explore/:query',
    loadComponent: () =>
      import('../app/features/explore/explore.component').then((file) => file.ExploreComponent),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('../app/features/explore/explore.component').then((file) => file.ExploreComponent),
  },
  {
    path: 'book_details/:key',
    loadComponent: () =>
      import('../app/features/book-details/book-details.component').then((file) => file.BookDetailsComponent),
  },
  {
    path: 'shelf',
    loadComponent: () =>
      import('../app/features/shelf/shelf.component').then((file) => file.ShelfComponent),
  },
  {
    path: 'book_details/:key',
    loadComponent: () =>
      import('../app/features/book-details/book-details.component').then((file) => file.BookDetailsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
