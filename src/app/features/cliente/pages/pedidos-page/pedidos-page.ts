import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Pedido } from '../../models/pedido.model';
import { PedidosClienteService } from '../../services/pedidos-cliente.service';
import { pedidoLabel } from '../../utils/pedido-labels';

@Component({ selector: 'app-pedidos-page', imports: [CurrencyPipe, DatePipe, RouterLink], templateUrl: './pedidos-page.html', styleUrl: './pedidos-page.scss' })
export class PedidosPage implements OnInit {
  private readonly service = inject(PedidosClienteService); private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute); protected readonly pedidos = signal<Pedido[]>([]);
  protected readonly loading = signal(true); protected readonly failed = signal(false); protected readonly label = pedidoLabel;
  protected readonly criada = this.route.snapshot.queryParamMap.get('criada'); protected readonly pagamento = this.route.snapshot.queryParamMap.get('pagamento');
  ngOnInit(): void { this.load(); }
  protected load(): void { this.loading.set(true); this.failed.set(false); this.service.listar().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
    .subscribe({ next: (pedidos) => this.pedidos.set(pedidos), error: () => this.failed.set(true) }); }
}
