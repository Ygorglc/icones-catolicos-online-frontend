import { Routes } from '@angular/router';

const placeholder = () =>
  import('./shared/components/page-placeholder/page-placeholder').then(
    (module) => module.PagePlaceholder,
  );

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((module) => module.PublicLayout),
    children: [
      {
        path: '',
        title: 'Ícones Católicos Artesanais',
        loadComponent: () =>
          import('./features/home/pages/home-page').then((module) => module.HomePage),
      },
      {
        path: 'catalogo', title: 'Catálogo | Ícones Católicos',
        loadComponent: () =>
          import('./features/catalogo/pages/catalogo-page/catalogo-page').then(
            (module) => module.CatalogoPage,
          ),
      },
      {
        path: 'catalogo/:id', title: 'Detalhes do ícone | Ícones Católicos',
        loadComponent: () =>
          import('./features/catalogo/pages/modelo-detalhe-page/modelo-detalhe-page').then(
            (module) => module.ModeloDetalhePage,
          ),
      },
      {
        path: 'certificados/:codigo',
        title: 'Certificado artesanal | Ícones Católicos',
        loadComponent: placeholder,
        data: {
          title: 'Autenticidade da peça',
          description: 'Consulta pública do certificado artesanal digital.',
        },
      },
      {
        path: 'login', title: 'Entrar | Ícones Católicos', loadComponent: placeholder,
        data: { title: 'Entrar', description: 'Acesso de clientes e administradores.' },
      },
      {
        path: 'cadastro', title: 'Criar conta | Ícones Católicos', loadComponent: placeholder,
        data: { title: 'Criar conta', description: 'Cadastro de novos clientes.' },
      },
    ],
  },
  {
    path: 'cliente',
    loadComponent: () =>
      import('./layouts/client-layout/client-layout').then((module) => module.ClientLayout),
    children: [
      {
        path: 'pedidos', title: 'Meus pedidos | Ícones Católicos', loadComponent: placeholder,
        data: {
          title: 'Meus pedidos',
          description: 'Acompanhamento das encomendas, pagamentos e certificados.',
        },
      },
      { path: '', pathMatch: 'full', redirectTo: 'pedidos' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then((module) => module.AdminLayout),
    children: [
      {
        path: '', title: 'Painel administrativo | Ícones Católicos', loadComponent: placeholder,
        data: {
          title: 'Painel administrativo',
          description: 'Gestão de encomendas, estoque, pagamentos e resultados.',
        },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
