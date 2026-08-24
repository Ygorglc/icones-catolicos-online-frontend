import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { FormaPagamento, TipoEntrega, TipoPagamento } from '../../models/checkout.model';
import { CheckoutService } from '../../services/checkout.service';

@Component({ selector: 'app-checkout-page', imports: [CurrencyPipe, ReactiveFormsModule, RouterLink], templateUrl: './checkout-page.html', styleUrl: './checkout-page.scss' })
export class CheckoutPage {
  private readonly fb = inject(FormBuilder); private readonly checkout = inject(CheckoutService);
  private readonly destroyRef = inject(DestroyRef); private readonly router = inject(Router);
  protected readonly carrinho = inject(CarrinhoService); protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = this.fb.nonNullable.group({
    tipoEntrega: ['RETIRADA' as TipoEntrega, Validators.required], enderecoEntrega: ['', Validators.maxLength(2000)],
    observacoes: ['', Validators.maxLength(2000)], tipoPagamento: ['SINAL' as TipoPagamento, Validators.required],
    formaPagamento: ['PIX' as FormaPagamento, Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting() || !this.carrinho.itens().length) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    if (value.tipoEntrega === 'ENTREGA' && !value.enderecoEntrega.trim()) { this.errorMessage.set('Informe o endereço para entrega.'); return; }
    this.submitting.set(true); this.errorMessage.set(null); let encomendaId = 0; let pagamentoRegistrado = true;
    this.checkout.criarEncomenda({ tipoEntrega: value.tipoEntrega, enderecoEntrega: value.tipoEntrega === 'ENTREGA' ? value.enderecoEntrega.trim() : null,
      observacoes: value.observacoes.trim() || null, itens: this.carrinho.itens().map((item) => ({ modeloIconeId: item.modeloIconeId, quantidade: item.quantidade, personalizacao: item.personalizacao })) })
      .pipe(tap((encomenda) => encomendaId = encomenda.id), switchMap((encomenda) => this.checkout.registrarPagamento(encomenda.id, value.tipoPagamento, value.formaPagamento)
          .pipe(catchError(() => { pagamentoRegistrado = false; return of(null); }))),
        takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false)))
      .subscribe({ next: () => { this.carrinho.limpar(); void this.router.navigate(['/cliente/pedidos'], { queryParams: { criada: encomendaId, pagamento: pagamentoRegistrado ? 'registrado' : 'pendente' } }); },
        error: () => this.errorMessage.set('Não foi possível criar a encomenda. Revise os dados e tente novamente.') });
  }
}
