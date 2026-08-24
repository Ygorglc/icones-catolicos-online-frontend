import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/services/api-client.service';
import { CertificadoCliente, HistoricoPagamentos, Pedido } from '../models/pedido.model';
import { FormaPagamento, TipoPagamento } from '../../checkout/models/checkout.model';

@Injectable({ providedIn: 'root' })
export class PedidosClienteService {
  private readonly api = inject(ApiClientService);
  listar(): Observable<Pedido[]> { return this.api.get<Pedido[]>('encomendas'); }
  buscar(id: number): Observable<Pedido> { return this.api.get<Pedido>(`encomendas/${id}`); }
  pagamentos(id: number): Observable<HistoricoPagamentos> { return this.api.get<HistoricoPagamentos>(`encomendas/${id}/pagamentos`); }
  certificado(id: number): Observable<CertificadoCliente> { return this.api.get<CertificadoCliente>(`encomendas/${id}/certificado`); }
  pagar(id: number, tipo: TipoPagamento | 'RESTANTE', forma: FormaPagamento) {
    const origem = forma === 'DINHEIRO' ? 'EXTERNO_MANUAL' : 'SIMULADO_SISTEMA';
    return this.api.post(`encomendas/${id}/pagamentos`, { tipo, forma, origem });
  }
}
