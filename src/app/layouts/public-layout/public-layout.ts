import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CarrinhoService } from '../../features/carrinho/services/carrinho.service';

@Component({
  selector: 'app-public-layout', imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public-layout.html', styleUrl: './public-layout.scss',
})
export class PublicLayout {
  protected readonly carrinho = inject(CarrinhoService); protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected logout(): void { this.carrinho.limparLocal(); this.auth.logout(); void this.router.navigateByUrl('/'); }
}
