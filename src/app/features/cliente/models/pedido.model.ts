import { PersonalizacaoCarrinho } from '../../carrinho/models/carrinho.model';
import { FormaPagamento, TipoEntrega, TipoPagamento } from '../../checkout/models/checkout.model';

export interface ItemPedido { id: number; modeloIconeId: number; modeloIconeNome: string; quantidade: number; valorUnitario: number; subtotal: number; personalizacao: PersonalizacaoCarrinho; }
export interface Pedido { id: number; clienteId: number; clienteNome: string; dataCriacao: string; statusEncomenda: string; statusFinanceiro: string; valorTotal: number; valorSinal: number; tipoEntrega: TipoEntrega; enderecoEntrega: string | null; observacoes: string | null; itens: ItemPedido[]; }
export interface Pagamento { id: number; tipo: TipoPagamento | 'RESTANTE'; forma: FormaPagamento; origem: string; valor: number; dataPagamento: string | null; status: string; referenciaSimulada: string; }
export interface HistoricoPagamentos { encomendaId: number; valorTotal: number; totalPago: number; saldoPendente: number; statusFinanceiro: string; pagamentos: Pagamento[]; }
export interface CertificadoCliente { numeroPeca: string; dataEmissao: string; nomeArtesao: string; modeloIcone: string; codigoPublico: string; }
