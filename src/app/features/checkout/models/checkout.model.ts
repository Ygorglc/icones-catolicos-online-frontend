import { PersonalizacaoCarrinho } from '../../carrinho/models/carrinho.model';

export type TipoEntrega = 'ENTREGA' | 'RETIRADA';
export type TipoPagamento = 'SINAL' | 'INTEGRAL';
export type FormaPagamento = 'PIX' | 'DINHEIRO' | 'DEPOSITO';

export interface CriarEncomendaRequest {
  tipoEntrega: TipoEntrega;
  enderecoEntrega: string | null;
  observacoes: string | null;
  itens: { modeloIconeId: number; quantidade: number; personalizacao: PersonalizacaoCarrinho }[];
}

export interface EncomendaResponse {
  id: number; valorTotal: number; valorSinal: number;
  statusEncomenda: string; statusFinanceiro: string;
}

export interface PagamentoResponse { id: number; status: string; totalPago: number; saldoPendente: number; }
