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
    return this.api.post(`encomendas/${id}/pagamentos`, { tipo, forma, origem: 'EXTERNO_MANUAL' });
  }
  anexarComprovante(encomendaId: number, pagamentoId: number, arquivo: File) {
    const formData = new FormData(); formData.append('arquivo', arquivo);
    return this.api.post(`encomendas/${encomendaId}/pagamentos/${pagamentoId}/comprovante`, formData);
  }
  baixarComprovante(encomendaId: number, pagamentoId: number) {
    return this.api.getBlob(`encomendas/${encomendaId}/pagamentos/${pagamentoId}/comprovante`);
  }
}
