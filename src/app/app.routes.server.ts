import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'cliente/**', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'certificados/:codigo', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender },
];
