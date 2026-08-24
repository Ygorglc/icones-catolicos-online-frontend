import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pagamento } from '../../../cliente/models/pedido.model';
import { pedidoLabel } from '../../../cliente/utils/pedido-labels';
import { AdminService } from '../../services/admin.service';
@Component({ selector: 'app-pagamentos-admin-page', imports: [CurrencyPipe], templateUrl: './pagamentos-admin-page.html', styleUrl: '../admin-table.scss' })
export class PagamentosAdminPage implements OnInit { private readonly service = inject(AdminService); private readonly destroyRef = inject(DestroyRef); protected readonly items = signal<Pagamento[]>([]); protected readonly message = signal<string | null>(null); protected readonly label = pedidoLabel; ngOnInit(): void { this.load(); } protected load(): void { this.service.pagamentosPendentes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: (items) => this.items.set(items), error: () => this.message.set('Não foi possível carregar os pagamentos.') }); } protected analyze(id: number, confirmed: boolean): void { this.service.analisarPagamento(id, confirmed).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: () => { this.items.update((all) => all.filter((item) => item.id !== id)); this.message.set(confirmed ? 'Pagamento confirmado.' : 'Pagamento recusado.'); }, error: () => this.message.set('Não foi possível analisar o pagamento.') }); } }
