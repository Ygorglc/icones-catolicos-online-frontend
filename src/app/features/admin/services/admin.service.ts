import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiClientService } from '../../../core/services/api-client.service';
import { CertificadoAdmin, ConfiguracaoLoja, GastoAdmin, IconeProntoAdmin, MaterialAdmin, ModeloIconeAdminRequest, ModeloIconeDetalhe, Pagamento, Pedido, RelatorioAdmin, VendaAdmin } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiClientService);
  encomendas() { return this.api.get<Pedido[]>('admin/encomendas'); }
  atualizarStatus(id: number, status: string) { return this.api.patch<Pedido, object>(`admin/encomendas/${id}/status`, { status }); }
  pagamentosPendentes() { return this.api.get<Pagamento[]>('admin/pagamentos/pendentes'); }
  analisarPagamento(id: number, confirmado: boolean) { return this.api.patch<Pagamento, object>(`admin/pagamentos/${id}/analise`, { confirmado, observacao: confirmado ? 'Confirmado pelo painel administrativo.' : 'Recusado pelo painel administrativo.' }); }
  baixarComprovante(id: number) { return this.api.getBlob(`admin/pagamentos/${id}/comprovante`); }
  confirmarPagamentoExterno(encomendaId: number, tipo: 'SINAL' | 'INTEGRAL', forma: 'PIX' | 'DINHEIRO' | 'DEPOSITO') { return this.api.post<Pagamento, object>(`admin/encomendas/${encomendaId}/pagamentos/confirmacao-externa`, { tipo, forma, origem: 'EXTERNO_MANUAL' }); }
  modelos() { return this.api.get<ModeloIconeDetalhe[]>('admin/modelos'); }
  criarModelo(request: ModeloIconeAdminRequest) { return this.api.post<ModeloIconeDetalhe, ModeloIconeAdminRequest>('admin/modelos', request); }
  atualizarModelo(id: number, request: ModeloIconeAdminRequest) { return this.api.put<ModeloIconeDetalhe, ModeloIconeAdminRequest>(`admin/modelos/${id}`, request); }
  desativarModelo(id: number) { return this.api.delete(`admin/modelos/${id}`); }
  materiais() { return this.api.get<MaterialAdmin[]>('admin/estoque/materiais'); }
  materiaisBaixos() { return this.api.get<MaterialAdmin[]>('admin/estoque/materiais/estoque-baixo'); }
  movimentarMaterial(id: number, quantidade: number, tipo: 'ENTRADA' | 'SAIDA') { return this.api.patch<MaterialAdmin, object>(`admin/estoque/materiais/${id}/movimentacoes`, { tipo, quantidade }); }
  iconesProntos() { return this.api.get<IconeProntoAdmin[]>('admin/estoque/icones-prontos'); }
  reservarIcone(encomendaId: number) { return this.api.post<IconeProntoAdmin, object>('admin/estoque/icones-prontos/reservas', { encomendaId }); }
  gastos() { return this.api.get<GastoAdmin[]>('admin/financeiro/gastos'); }
  vendas() { return this.api.get<VendaAdmin[]>('admin/financeiro/vendas'); }
  relatorio(inicio: string, fim: string) { return this.api.get<RelatorioAdmin>('admin/financeiro/relatorios', new HttpParams().set('inicio', inicio).set('fim', fim)); }
  certificados() { return this.api.get<CertificadoAdmin[]>('admin/certificados'); }
  configuracaoLoja() { return this.api.get<ConfiguracaoLoja>('admin/configuracao-loja'); }
  atualizarConfiguracaoLoja(request: ConfiguracaoLoja) { return this.api.put<ConfiguracaoLoja, ConfiguracaoLoja>('admin/configuracao-loja', request); }
  resumo() { return forkJoin({ encomendas: this.encomendas(), pagamentos: this.pagamentosPendentes(), materiais: this.materiaisBaixos(), modelos: this.modelos(), icones: this.iconesProntos(), gastos: this.gastos(), vendas: this.vendas() }); }
}
