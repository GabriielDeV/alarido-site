import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'biblia',
    loadComponent: () =>
      import('./features/bible/pages/bible-selection-page/bible-selection-page.component').then(
        (m) => m.BibleSelectionPageComponent,
      ),
  },
  {
    path: 'biblia/:bookId/:chapterNumber',
    loadComponent: () =>
      import('./features/bible/pages/bible-reader-page/bible-reader-page.component').then(
        (m) => m.BibleReaderPageComponent,
      ),
  },
  {
    path: 'mensagens',
    loadComponent: () =>
      import('./features/messages/pages/message-list-page/message-list-page.component').then(
        (m) => m.MessageListPageComponent,
      ),
  },
  {
    path: 'mensagens/:messageId',
    loadComponent: () =>
      import('./features/messages/pages/message-reader-page/message-reader-page.component').then(
        (m) => m.MessageReaderPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
