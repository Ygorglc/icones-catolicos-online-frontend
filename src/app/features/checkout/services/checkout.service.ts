import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/services/api-client.service';
import { CriarEncomendaRequest, EncomendaResponse, FormaPagamento, PagamentoResponse, TipoPagamento } from '../models/checkout.model';

export interface ConfiguracaoCheckout { entregaHabilitada: boolean; chavePix: string | null; dadosDeposito: string | null; }

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly api = inject(ApiClientService);
  criarEncomenda(request: CriarEncomendaRequest): Observable<EncomendaResponse> {
    return this.api.post<EncomendaResponse, CriarEncomendaRequest>('encomendas', request);
  }
  configuracao(): Observable<ConfiguracaoCheckout> { return this.api.get<ConfiguracaoCheckout>('publico/configuracao-loja'); }
  registrarPagamento(encomendaId: number, tipo: TipoPagamento, forma: FormaPagamento): Observable<PagamentoResponse> {
    return this.api.post<PagamentoResponse, object>(`encomendas/${encomendaId}/pagamentos`, { tipo, forma, origem: 'EXTERNO_MANUAL' });
  }
  anexarComprovante(encomendaId: number, pagamentoId: number, arquivo: File): Observable<PagamentoResponse> {
    const formData = new FormData(); formData.append('arquivo', arquivo);
    return this.api.post<PagamentoResponse, FormData>(`encomendas/${encomendaId}/pagamentos/${pagamentoId}/comprovante`, formData);
  }
}
