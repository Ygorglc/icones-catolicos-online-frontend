import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/services/api-client.service';
import { CriarEncomendaRequest, EncomendaResponse, FormaPagamento, PagamentoResponse, TipoPagamento } from '../models/checkout.model';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly api = inject(ApiClientService);
  criarEncomenda(request: CriarEncomendaRequest): Observable<EncomendaResponse> {
    return this.api.post<EncomendaResponse, CriarEncomendaRequest>('encomendas', request);
  }
  registrarPagamento(encomendaId: number, tipo: TipoPagamento, forma: FormaPagamento): Observable<PagamentoResponse> {
    const origem = forma === 'DINHEIRO' ? 'EXTERNO_MANUAL' : 'SIMULADO_SISTEMA';
    return this.api.post<PagamentoResponse, object>(`encomendas/${encomendaId}/pagamentos`, { tipo, forma, origem });
  }
}
