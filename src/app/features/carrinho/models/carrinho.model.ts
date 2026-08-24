export type TamanhoIcone = 'PEQUENO' | 'MEDIO' | 'GRANDE' | 'PERSONALIZADO';

export interface PersonalizacaoCarrinho {
  tamanho: TamanhoIcone;
  acabamento: string | null;
  frase: string | null;
  nomeFamilia: string | null;
  observacoes: string | null;
}

export interface ItemCarrinho {
  chave: string;
  modeloIconeId: number;
  nome: string;
  imagemUrl: string | null;
  precoUnitario: number;
  quantidade: number;
  personalizacao: PersonalizacaoCarrinho;
}
