import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { FormaPagamento } from '../../../checkout/models/checkout.model';
import { CertificadoCliente, HistoricoPagamentos, Pagamento, Pedido } from '../../models/pedido.model';
import { PedidosClienteService } from '../../services/pedidos-cliente.service';
import { pedidoLabel } from '../../utils/pedido-labels';

@Component({ selector: 'app-pedido-detalhe-page', imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink], templateUrl: './pedido-detalhe-page.html', styleUrl: './pedido-detalhe-page.scss' })
export class PedidoDetalhePage implements OnInit {
  private readonly route = inject(ActivatedRoute); private readonly service = inject(PedidosClienteService);
  private readonly destroyRef = inject(DestroyRef); private readonly fb = inject(FormBuilder);
  protected readonly pedido = signal<Pedido | null>(null); protected readonly historico = signal<HistoricoPagamentos | null>(null);
  protected readonly certificado = signal<CertificadoCliente | null>(null); protected readonly loading = signal(true);
  protected readonly failed = signal(false); protected readonly paying = signal(false); protected readonly message = signal<string | null>(null);
  protected readonly uploadingPaymentId = signal<number | null>(null);
  protected readonly mostrarAvisoPagamento = signal(false);
  protected readonly label = pedidoLabel; protected readonly paymentForm = this.fb.nonNullable.group({ forma: ['PIX' as FormaPagamento] });
  protected readonly etapas = ['ENCOMENDA_CRIADA', 'EM_PRODUCAO', 'ENVIADO_OU_RETIRADO', 'ENTREGUE_E_CONCLUIDO'];
  ngOnInit(): void { this.load(); }
  protected fecharAvisoPagamento(): void { this.mostrarAvisoPagamento.set(false); }
  protected load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); if (!Number.isInteger(id) || id <= 0) { this.failed.set(true); this.loading.set(false); return; }
    this.loading.set(true); this.failed.set(false);
    forkJoin({ pedido: this.service.buscar(id), historico: this.service.pagamentos(id), certificado: this.service.certificado(id).pipe(catchError(() => of(null))) })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({ next: ({ pedido, historico, certificado }) => {
        this.pedido.set(pedido); this.historico.set(historico); this.certificado.set(certificado);
        this.mostrarAvisoPagamento.set(
          pedido.statusEncomenda === 'AGUARDANDO_PAGAMENTO_INICIAL');
      }, error: () => this.failed.set(true) });
  }
  protected etapaConcluida(etapa: string): boolean {
    const atual = this.pedido()?.statusEncomenda; if (!atual || atual === 'CANCELADO') return false;
    const etapaAtual = atual === 'AGUARDANDO_PAGAMENTO_INICIAL' ? 'ENCOMENDA_CRIADA' : atual;
    const indiceAtual = this.etapas.indexOf(etapaAtual); const indice = this.etapas.indexOf(etapa);
    if (atual === 'AGUARDANDO_PAGAMENTO_RESTANTE') return indice <= this.etapas.indexOf('EM_PRODUCAO');
    return indiceAtual >= indice;
  }
  protected pagar(): void {
    const pedido = this.pedido(); if (!pedido || this.paying()) return; this.paying.set(true); this.message.set(null);
    const tipo = (this.historico()?.totalPago ?? 0) > 0 ? 'RESTANTE' : 'SINAL';
    this.service.pagar(pedido.id, tipo, this.paymentForm.controls.forma.value).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.paying.set(false)))
      .subscribe({ next: () => { this.message.set('Pagamento registrado e enviado para confirmação.'); this.load(); }, error: () => this.message.set('Não foi possível registrar o pagamento.') });
  }
  protected anexarComprovante(pagamento: Pagamento, event: Event): void {
    const pedido = this.pedido(); const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0]; if (!pedido || !arquivo) return;
    const permitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!permitidos.includes(arquivo.type) || arquivo.size > 10 * 1024 * 1024) {
      input.value = ''; this.message.set('Envie um comprovante PDF, JPG, PNG ou WEBP de até 10 MB.'); return;
    }
    this.uploadingPaymentId.set(pagamento.id); this.message.set(null);
    this.service.anexarComprovante(pedido.id, pagamento.id, arquivo)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.uploadingPaymentId.set(null)))
      .subscribe({ next: () => { this.message.set('Comprovante anexado com sucesso.'); this.load(); }, error: () => this.message.set('Não foi possível anexar o comprovante.') });
  }
  protected baixarComprovante(pagamento: Pagamento): void {
    const pedido = this.pedido(); if (!pedido) return;
    this.service.baixarComprovante(pedido.id, pagamento.id).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (blob) => { const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = pagamento.comprovanteNomeOriginal ?? 'comprovante'; link.click(); URL.revokeObjectURL(url); }, error: () => this.message.set('Não foi possível baixar o comprovante.') });
  }
}
