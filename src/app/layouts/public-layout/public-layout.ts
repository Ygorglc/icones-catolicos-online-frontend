import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CarrinhoService } from '../../features/carrinho/services/carrinho.service';

@Component({
  selector: 'app-public-layout', imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public-layout.html', styleUrl: './public-layout.scss',
})
export class PublicLayout { protected readonly carrinho = inject(CarrinhoService); }
