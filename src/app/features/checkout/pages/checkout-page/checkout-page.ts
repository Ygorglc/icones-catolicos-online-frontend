import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { FormaPagamento, TipoEntrega, TipoPagamento } from '../../models/checkout.model';
import { CheckoutService } from '../../services/checkout.service';
import { PerfilClienteService } from '../../../cliente/services/perfil-cliente.service';
import { EnderecoCliente } from '../../../cliente/models/perfil-cliente.model';
import { ESTADOS_BRASIL } from '../../../../shared/data/estados-brasil';
import { cepValidator } from '../../../../shared/validators/cep.validator';

@Component({ selector: 'app-checkout-page', imports: [CurrencyPipe, ReactiveFormsModule, RouterLink], templateUrl: './checkout-page.html', styleUrl: './checkout-page.scss' })
export class CheckoutPage implements OnInit {
  private readonly fb = inject(FormBuilder); private readonly checkout = inject(CheckoutService);
  private readonly destroyRef = inject(DestroyRef); private readonly router = inject(Router);
  protected readonly carrinho = inject(CarrinhoService); protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly perfil = inject(PerfilClienteService);
  protected readonly enderecos = signal<EnderecoCliente[]>([]); protected readonly enderecoSelecionado = signal<number | null>(null);
  protected readonly cadastrandoEndereco = signal(false); protected readonly estados = ESTADOS_BRASIL;
  protected readonly form = this.fb.nonNullable.group({
    tipoEntrega: ['RETIRADA' as TipoEntrega, Validators.required],
    observacoes: ['', Validators.maxLength(2000)], tipoPagamento: ['SINAL' as TipoPagamento, Validators.required],
    formaPagamento: ['PIX' as FormaPagamento, Validators.required],
  });
  protected readonly enderecoForm = this.fb.nonNullable.group({ apelido: ['Casa', [Validators.required, Validators.maxLength(60)]], cep: ['', [Validators.required, cepValidator]], logradouro: ['', [Validators.required, Validators.maxLength(150)]], numero: ['', [Validators.required, Validators.maxLength(20)]], complemento: ['', Validators.maxLength(100)], bairro: ['', [Validators.required, Validators.maxLength(100)]], cidade: ['', [Validators.required, Validators.maxLength(100)]], uf: ['', Validators.required], principal: [true] });

  ngOnInit(): void { this.carregarEnderecos(); }

  protected submit(): void {
    if (this.form.invalid || this.submitting() || !this.carrinho.itens().length) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    const endereco = this.enderecos().find((item) => item.id === this.enderecoSelecionado());
    if (value.tipoEntrega === 'ENTREGA' && !endereco) { this.errorMessage.set('Selecione ou cadastre um endereço para entrega.'); return; }
    this.submitting.set(true); this.errorMessage.set(null); let encomendaId = 0; let pagamentoRegistrado = true;
    this.checkout.criarEncomenda({ tipoEntrega: value.tipoEntrega, enderecoEntrega: value.tipoEntrega === 'ENTREGA' && endereco ? this.formatarEndereco(endereco) : null,
      observacoes: value.observacoes.trim() || null, itens: this.carrinho.itens().map((item) => ({ modeloIconeId: item.modeloIconeId, quantidade: item.quantidade, personalizacao: item.personalizacao })) })
      .pipe(tap((encomenda) => encomendaId = encomenda.id), switchMap((encomenda) => this.checkout.registrarPagamento(encomenda.id, value.tipoPagamento, value.formaPagamento)
          .pipe(catchError(() => { pagamentoRegistrado = false; return of(null); }))),
        takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false)))
      .subscribe({ next: () => { this.carrinho.limpar(); void this.router.navigate(['/cliente/pedidos'], { queryParams: { criada: encomendaId, pagamento: pagamentoRegistrado ? 'registrado' : 'pendente' } }); },
        error: () => this.errorMessage.set('Não foi possível criar a encomenda. Revise os dados e tente novamente.') });
  }

  protected selecionarEndereco(endereco: EnderecoCliente): void {
    this.enderecoSelecionado.set(endereco.id);
    if (endereco.principal) return;
    const request = { apelido: endereco.apelido, cep: endereco.cep, logradouro: endereco.logradouro, numero: endereco.numero, complemento: endereco.complemento, bairro: endereco.bairro, cidade: endereco.cidade, uf: endereco.uf, principal: true };
    this.perfil.atualizarEndereco(endereco.id, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: () => this.carregarEnderecos(), error: () => this.errorMessage.set('O endereço foi selecionado, mas não foi possível defini-lo como principal.') });
  }

  protected salvarNovoEndereco(): void {
    if (this.enderecoForm.invalid || this.submitting()) { this.enderecoForm.markAllAsTouched(); return; }
    const v = this.enderecoForm.getRawValue(); const request = { ...v, apelido: v.apelido.trim(), cep: v.cep.trim(), logradouro: v.logradouro.trim(), numero: v.numero.trim(), complemento: v.complemento.trim() || null, bairro: v.bairro.trim(), cidade: v.cidade.trim(), uf: v.uf, principal: true };
    this.submitting.set(true); this.perfil.criarEndereco(request).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false))).subscribe({ next: (endereco) => { this.enderecoSelecionado.set(endereco.id); this.cadastrandoEndereco.set(false); this.enderecoForm.reset({ apelido: 'Casa', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', principal: true }); this.carregarEnderecos(); }, error: () => this.errorMessage.set('Não foi possível cadastrar o endereço. Revise os dados.') });
  }

  private carregarEnderecos(): void { this.perfil.listarEnderecos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (items) => { this.enderecos.set(items); const atual = this.enderecoSelecionado(); if (!atual || !items.some((item) => item.id === atual)) this.enderecoSelecionado.set(items.find((item) => item.principal)?.id ?? items[0]?.id ?? null); }, error: () => this.errorMessage.set('Não foi possível carregar seus endereços.') }); }
  private formatarEndereco(e: EnderecoCliente): string { return `${e.logradouro}, ${e.numero}${e.complemento ? ` - ${e.complemento}` : ''} - ${e.bairro}, ${e.cidade}/${e.uf} - CEP ${e.cep}`; }
}
