import type { Pedido, Pagamento } from '../../cliente/models/pedido.model';
import type { ModeloIconeDetalhe } from '../../catalogo/models/modelo-icone.model';
export type { Pedido, Pagamento, ModeloIconeDetalhe };
export interface MaterialAdmin { id: number; nome: string; unidadeMedida: string; quantidade: number; custoUnitario: number; estoqueMinimo: number; estoqueBaixo: boolean; }
export interface IconeProntoAdmin { id: number; modeloIconeId: number; modeloIconeNome: string; encomendaId: number | null; tamanho: string; acabamento: string; custoProducao: number; precoSugerido: number; status: string; localizacao: string; }
export interface GastoAdmin { id: number; encomendaId: number | null; descricao: string; valor: number; dataGasto: string; categoria: string; }
export interface VendaAdmin { id: number; encomendaId: number; clienteNome: string; valorTotal: number; custoTotal: number; lucroBruto: number; lucroLiquidoEstimado: number; dataVenda: string; }
export interface RelatorioAdmin { inicio: string; fim: string; quantidadeVendas: number; quantidadeGastos: number; receitaTotal: number; gastosDoPeriodo: number; lucroBrutoTotal: number; lucroLiquidoEstimadoTotal: number; resultadoDoPeriodo: number; vendas: VendaAdmin[]; gastos: GastoAdmin[]; }
export interface CertificadoAdmin { id: number; encomendaId: number; numeroPeca: string; dataEmissao: string; nomeArtesao: string; modeloIcone: string; codigoPublico: string; autentico: boolean; }
