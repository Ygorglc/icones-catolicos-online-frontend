import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiClientService } from '../../../core/services/api-client.service';
import { ItemCarrinho } from '../models/carrinho.model';

const GUEST_KEY = 'oficina-sao-jose.carrinho.visitante';
const LEGACY_KEY = 'oficina-sao-jose.carrinho';
interface RemoteItem extends Omit<ItemCarrinho, 'chave'> { id: number; }

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly platformId = inject(PLATFORM_ID); private readonly auth = inject(AuthService); private readonly api = inject(ApiClientService);
  private readonly state = signal<ItemCarrinho[]>([]); private currentUserId: number | null = null;
  readonly itens = this.state.asReadonly(); readonly quantidade = computed(() => this.state().reduce((t, i) => t + i.quantidade, 0));
  readonly subtotal = computed(() => this.state().reduce((t, i) => t + i.precoUnitario * i.quantidade, 0));

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.restoreGuest();
    effect(() => {
      const session = this.auth.session(); const userId = session?.perfil === 'CLIENTE' ? session.usuarioId : null;
      if (userId === this.currentUserId) return; this.currentUserId = userId;
      if (userId === null) this.restoreGuest(); else this.syncAuthenticated();
    });
  }

  adicionar(item: Omit<ItemCarrinho, 'chave'>): void {
    if (!this.currentUserId) { this.state.update((all) => [...all, { ...item, chave: this.tempKey() }]); this.persistGuest(); return; }
    const temp = this.tempKey(); this.state.update((all) => [...all, { ...item, chave: temp }]);
    this.api.post<RemoteItem, object>('carrinho/itens', this.toRequest(item)).subscribe({ next: (saved) => this.state.update((all) => all.map((i) => i.chave === temp ? this.fromRemote(saved) : i)), error: () => this.state.update((all) => all.filter((i) => i.chave !== temp)) });
  }

  alterarQuantidade(chave: string, quantidade: number): void {
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) return;
    const previous = this.state().find((i) => i.chave === chave)?.quantidade; this.state.update((all) => all.map((i) => i.chave === chave ? { ...i, quantidade } : i));
    if (!this.currentUserId) { this.persistGuest(); return; }
    this.api.patch<RemoteItem, object>(`carrinho/itens/${chave}`, { quantidade }).subscribe({ error: () => { if (previous) this.state.update((all) => all.map((i) => i.chave === chave ? { ...i, quantidade: previous } : i)); } });
  }

  remover(chave: string): void {
    const removed = this.state().find((i) => i.chave === chave); this.state.update((all) => all.filter((i) => i.chave !== chave));
    if (!this.currentUserId) { this.persistGuest(); return; }
    this.api.delete(`carrinho/itens/${chave}`).subscribe({ error: () => { if (removed) this.state.update((all) => [...all, removed]); } });
  }

  limpar(): void { this.state.set([]); if (!this.currentUserId) this.persistGuest(); else this.api.delete('carrinho').subscribe(); }

  limparLocal(): void {
    this.state.set([]);
    localStorage.removeItem(GUEST_KEY);
    localStorage.removeItem(LEGACY_KEY);
  }

  private syncAuthenticated(): void {
    const guest = this.readGuest();
    this.api.get<RemoteItem[]>('carrinho').subscribe({ next: (remote) => {
      if (!guest.length) { this.state.set(remote.map((i) => this.fromRemote(i))); return; }
      forkJoin(guest.map((item) => this.api.post<RemoteItem, object>('carrinho/itens', this.toRequest(item)).pipe(catchError(() => of(null)))))
        .subscribe((migrated) => { const added = migrated.filter((i): i is RemoteItem => i !== null); this.state.set([...remote, ...added].map((i) => this.fromRemote(i))); localStorage.removeItem(GUEST_KEY); localStorage.removeItem(LEGACY_KEY); });
    } });
  }

  private toRequest(item: Omit<ItemCarrinho, 'chave'> | ItemCarrinho) { return { modeloIconeId: item.modeloIconeId, quantidade: item.quantidade, personalizacao: item.personalizacao }; }
  private fromRemote(item: RemoteItem): ItemCarrinho { return { ...item, chave: String(item.id) }; }
  private tempKey(): string { return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
  private persistGuest(): void { localStorage.setItem(GUEST_KEY, JSON.stringify(this.state())); localStorage.removeItem(LEGACY_KEY); }
  private restoreGuest(): void { this.state.set(this.readGuest()); }
  private readGuest(): ItemCarrinho[] { try { const raw = localStorage.getItem(GUEST_KEY) ?? localStorage.getItem(LEGACY_KEY); const items = raw ? JSON.parse(raw) as ItemCarrinho[] : []; return Array.isArray(items) ? items.filter((i) => i.modeloIconeId && i.quantidade > 0) : []; } catch { localStorage.removeItem(GUEST_KEY); localStorage.removeItem(LEGACY_KEY); return []; } }
}
