import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({ selector: 'app-carrinho-page', imports: [CurrencyPipe, RouterLink], templateUrl: './carrinho-page.html', styleUrl: './carrinho-page.scss' })
export class CarrinhoPage {
  protected readonly carrinho = inject(CarrinhoService);
  protected change(chave: string, event: Event): void {
    this.carrinho.alterarQuantidade(chave, Number((event.target as HTMLInputElement).value));
  }
}
