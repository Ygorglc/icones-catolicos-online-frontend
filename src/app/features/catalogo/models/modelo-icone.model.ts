export interface ModeloIconeResumo {
  id: number;
  nome: string;
  imagemUrl: string | null;
  precoBase: number;
}

export interface ConteudoDevocional {
  id: number;
  historia: string | null;
  significado: string | null;
  simbologia: string | null;
  oracao: string | null;
  ocasiaoPresente: string | null;
  cuidados: string | null;
}

export interface ModeloIconeDetalhe extends ModeloIconeResumo {
  descricao: string;
  ativo: boolean;
  criadoEm: string;
  conteudoDevocional: ConteudoDevocional | null;
}
