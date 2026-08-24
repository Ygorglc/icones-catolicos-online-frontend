import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TamanhoIcone } from '../../../carrinho/models/carrinho.model';
import { CarrinhoService } from '../../../carrinho/services/carrinho.service';
import { ModeloIconeDetalhe } from '../../models/modelo-icone.model';
import { CatalogoService } from '../../services/catalogo.service';

@Component({ selector: 'app-modelo-detalhe-page', imports: [CurrencyPipe, ReactiveFormsModule, RouterLink], templateUrl: './modelo-detalhe-page.html', styleUrl: './modelo-detalhe-page.scss' })
export class ModeloDetalhePage implements OnInit {
  private readonly route = inject(ActivatedRoute); private readonly service = inject(CatalogoService); private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder); private readonly carrinho = inject(CarrinhoService); private readonly router = inject(Router);
  protected readonly modelo = signal<ModeloIconeDetalhe | null>(null); protected readonly loading = signal(true); protected readonly failed = signal(false);
  protected readonly form = this.fb.nonNullable.group({ tamanho: ['MEDIO' as TamanhoIcone, Validators.required], acabamento: [''], frase: ['', Validators.maxLength(255)], nomeFamilia: ['', Validators.maxLength(120)], observacoes: ['', Validators.maxLength(2000)], quantidade: [1, [Validators.required, Validators.min(1), Validators.max(99)]] });
  ngOnInit(): void { this.load(); }
  protected load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) { this.failed.set(true); this.loading.set(false); return; }
    this.loading.set(true); this.failed.set(false);
    this.service.buscarModelo(id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({ next: (modelo) => this.modelo.set(modelo), error: () => this.failed.set(true) });
  }
  protected adicionar(): void {
    const modelo = this.modelo(); if (!modelo || this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue(); const optional = (text: string) => text.trim() || null;
    this.carrinho.adicionar({ modeloIconeId: modelo.id, nome: modelo.nome, imagemUrl: modelo.imagemUrl,
      precoUnitario: modelo.precoBase, quantidade: value.quantidade, personalizacao: { tamanho: value.tamanho,
        acabamento: optional(value.acabamento), frase: optional(value.frase), nomeFamilia: optional(value.nomeFamilia), observacoes: optional(value.observacoes) } });
    void this.router.navigateByUrl('/carrinho');
  }
  protected useFallback(event: Event): void { (event.target as HTMLImageElement).src = '/images/logo-oficina-sao-jose.jpg'; }
}
