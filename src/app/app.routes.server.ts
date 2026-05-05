import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'biblia/:bookId/:chapterNumber',
    renderMode: RenderMode.Client,
  },
  {
    path: 'mensagens/:messageId',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
