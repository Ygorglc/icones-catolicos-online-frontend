import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AdminService } from '../../services/admin.service';

interface Dashboard { encomendas: number; emProducao: number; pagamentos: number; estoqueBaixo: number; modelosAtivos: number; iconesDisponiveis: number; vendas: number; receita: number; gastos: number; }
@Component({ selector: 'app-dashboard-page', imports: [CurrencyPipe, RouterLink], templateUrl: './dashboard-page.html', styleUrl: './dashboard-page.scss' })
export class DashboardPage implements OnInit {
  private readonly service = inject(AdminService); private readonly destroyRef = inject(DestroyRef);
  protected readonly data = signal<Dashboard | null>(null); protected readonly loading = signal(true); protected readonly failed = signal(false);
  ngOnInit(): void { this.load(); }
  protected load(): void { this.loading.set(true); this.failed.set(false); this.service.resumo().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false))).subscribe({ next: (r) => this.data.set({ encomendas: r.encomendas.length, emProducao: r.encomendas.filter((e) => e.statusEncomenda === 'EM_PRODUCAO').length, pagamentos: r.pagamentos.length, estoqueBaixo: r.materiais.length, modelosAtivos: r.modelos.filter((m) => m.ativo).length, iconesDisponiveis: r.icones.filter((i) => i.status === 'DISPONIVEL').length, vendas: r.vendas.length, receita: r.vendas.reduce((t, v) => t + v.valorTotal, 0), gastos: r.gastos.reduce((t, g) => t + g.valor, 0) }), error: () => this.failed.set(true) }); }
}
