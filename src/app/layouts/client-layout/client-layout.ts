import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CarrinhoService } from '../../features/carrinho/services/carrinho.service';

@Component({ selector: 'app-client-layout', imports: [RouterLink, RouterOutlet], templateUrl: './client-layout.html', styleUrl: './client-layout.scss' })
export class ClientLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly carrinho = inject(CarrinhoService);
  protected readonly session = this.auth.session;

  protected logout(): void {
    this.carrinho.limparLocal();
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
