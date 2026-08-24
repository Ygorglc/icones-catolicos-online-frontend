import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Pedido } from '../../../cliente/models/pedido.model';
import { pedidoLabel } from '../../../cliente/utils/pedido-labels';
import { AdminService } from '../../services/admin.service';

@Component({ selector: 'app-encomendas-admin-page', imports: [CurrencyPipe, DatePipe], templateUrl: './encomendas-admin-page.html', styleUrl: '../admin-table.scss' })
export class EncomendasAdminPage implements OnInit {
  private readonly service = inject(AdminService); private readonly destroyRef = inject(DestroyRef);
  protected readonly items = signal<Pedido[]>([]); protected readonly loading = signal(true); protected readonly message = signal<string | null>(null); protected readonly label = pedidoLabel;
  protected readonly statuses = ['PRODUCAO_LIBERADA','EM_PRODUCAO','EM_ACABAMENTO','PRONTO_PARA_ENTREGA_RETIRADA','AGUARDANDO_PAGAMENTO_RESTANTE','ENVIADO_OU_RETIRADO','CONCLUIDO','CANCELADO'];
  ngOnInit(): void { this.load(); }
  protected load(): void { this.loading.set(true); this.service.encomendas().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false))).subscribe({ next: (items) => this.items.set(items), error: () => this.message.set('Não foi possível carregar as encomendas.') }); }
  protected update(order: Pedido, event: Event): void { const status = (event.target as HTMLSelectElement).value; if (!status || status === order.statusEncomenda) return; this.service.atualizarStatus(order.id, status).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (updated) => { this.items.update((all) => all.map((item) => item.id === updated.id ? updated : item)); this.message.set(`Encomenda #${order.id} atualizada.`); }, error: () => { (event.target as HTMLSelectElement).value = order.statusEncomenda; this.message.set('Transição de status não permitida pela regra de negócio.'); } }); }
  protected reserve(id: number): void { this.service.reservarIcone(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: () => this.message.set(`Peça pronta reservada para a encomenda #${id}.`), error: () => this.message.set('Não há peça pronta compatível disponível.') }); }
}
