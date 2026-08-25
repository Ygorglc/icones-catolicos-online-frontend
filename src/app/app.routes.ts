import { Routes } from '@angular/router';
import { adminGuard, clientGuard } from './core/guards/role.guard';

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
        path: 'login', title: 'Entrar | Ícones Católicos',
        loadComponent: () =>
          import('./features/autenticacao/pages/login-page/login-page').then(
            (module) => module.LoginPage,
          ),
      },
      {
        path: 'cadastro', title: 'Criar conta | Ícones Católicos',
        loadComponent: () =>
          import('./features/autenticacao/pages/cadastro-page/cadastro-page').then(
            (module) => module.CadastroPage,
          ),
      },
      {
        path: 'carrinho', title: 'Carrinho | Ícones Católicos',
        loadComponent: () => import('./features/carrinho/pages/carrinho-page/carrinho-page').then(
          (module) => module.CarrinhoPage),
      },
      {
        path: 'checkout', title: 'Checkout | Ícones Católicos', canActivate: [clientGuard],
        loadComponent: () => import('./features/checkout/pages/checkout-page/checkout-page').then(
          (module) => module.CheckoutPage),
      },
    ],
  },
  {
    path: 'cliente',
    canActivate: [clientGuard],
    loadComponent: () =>
      import('./layouts/client-layout/client-layout').then((module) => module.ClientLayout),
    children: [
      {
        path: 'pedidos', title: 'Meus pedidos | Ícones Católicos',
        loadComponent: () => import('./features/cliente/pages/pedidos-page/pedidos-page').then(
          (module) => module.PedidosPage),
      },
      {
        path: 'pedidos/:id', title: 'Detalhes do pedido | Ícones Católicos',
        loadComponent: () => import('./features/cliente/pages/pedido-detalhe-page/pedido-detalhe-page').then(
          (module) => module.PedidoDetalhePage),
      },
      {
        path: 'perfil', title: 'Meu perfil | Ícones Católicos',
        loadComponent: () => import('./features/cliente/pages/perfil-page/perfil-page').then(
          (module) => module.PerfilPage),
      },
      { path: '', pathMatch: 'full', redirectTo: 'pedidos' },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then((module) => module.AdminLayout),
    children: [
      {
        path: '', title: 'Painel administrativo | Ícones Católicos',
        loadComponent: () => import('./features/admin/pages/dashboard-page/dashboard-page').then((module) => module.DashboardPage),
      },
      { path: 'encomendas', title: 'Encomendas | Administração', loadComponent: () => import('./features/admin/pages/encomendas-admin-page/encomendas-admin-page').then((module) => module.EncomendasAdminPage) },
      { path: 'pagamentos', title: 'Pagamentos | Administração', loadComponent: () => import('./features/admin/pages/pagamentos-admin-page/pagamentos-admin-page').then((module) => module.PagamentosAdminPage) },
      { path: 'estoque', title: 'Estoque | Administração', loadComponent: () => import('./features/admin/pages/estoque-admin-page/estoque-admin-page').then((module) => module.EstoqueAdminPage) },
      { path: 'modelos', title: 'Modelos | Administração', loadComponent: () => import('./features/admin/pages/modelos-admin-page/modelos-admin-page').then((module) => module.ModelosAdminPage) },
      { path: 'financeiro', title: 'Financeiro | Administração', loadComponent: () => import('./features/admin/pages/financeiro-admin-page/financeiro-admin-page').then((module) => module.FinanceiroAdminPage) },
      { path: 'certificados', title: 'Certificados | Administração', loadComponent: () => import('./features/admin/pages/certificados-admin-page/certificados-admin-page').then((module) => module.CertificadosAdminPage) },
    ],
  },
  { path: '**', redirectTo: '' },
];
