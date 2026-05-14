import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/auth-callback-page/auth-callback-page.component').then(
        (m) => m.AuthCallbackPageComponent,
      ),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'biblia',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/bible/pages/bible-selection-page/bible-selection-page.component').then(
        (m) => m.BibleSelectionPageComponent,
      ),
  },
  {
    path: 'biblia/:bookId/:chapterNumber',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/bible/pages/bible-reader-page/bible-reader-page.component').then(
        (m) => m.BibleReaderPageComponent,
      ),
  },
  {
    path: 'mensagens',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/messages/pages/message-list-page/message-list-page.component').then(
        (m) => m.MessageListPageComponent,
      ),
  },
  {
    path: 'mensagens/:messageId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/messages/pages/message-reader-page/message-reader-page.component').then(
        (m) => m.MessageReaderPageComponent,
      ),
  },
  {
    path: 'configuracoes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
