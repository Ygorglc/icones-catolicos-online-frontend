import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ItemCarrinho } from '../models/carrinho.model';

const STORAGE_KEY = 'oficina-sao-jose.carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly state = signal<ItemCarrinho[]>([]);
  readonly itens = this.state.asReadonly();
  readonly quantidade = computed(() => this.state().reduce((total, item) => total + item.quantidade, 0));
  readonly subtotal = computed(() => this.state().reduce((total, item) => total + item.precoUnitario * item.quantidade, 0));

  constructor() { if (isPlatformBrowser(this.platformId)) this.restore(); }

  adicionar(item: Omit<ItemCarrinho, 'chave'>): void {
    const chave = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.state.update((itens) => [...itens, { ...item, chave }]);
    this.persist();
  }

  alterarQuantidade(chave: string, quantidade: number): void {
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) return;
    this.state.update((itens) => itens.map((item) => item.chave === chave ? { ...item, quantidade } : item));
    this.persist();
  }

  remover(chave: string): void { this.state.update((itens) => itens.filter((item) => item.chave !== chave)); this.persist(); }
  limpar(): void { this.state.set([]); this.persist(); }

  private persist(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
  }

  private restore(): void {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) return;
      const itens = JSON.parse(value) as ItemCarrinho[];
      if (Array.isArray(itens)) this.state.set(itens.filter((item) => item.modeloIconeId && item.quantidade > 0));
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }
}
