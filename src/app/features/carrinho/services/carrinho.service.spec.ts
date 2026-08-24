import { TestBed } from '@angular/core/testing';
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
  let service: CarrinhoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrinhoService);
  });

  afterEach(() => localStorage.clear());

  it('should add items and calculate estimated subtotal', () => {
    service.adicionar({ modeloIconeId: 2, nome: 'São José', imagemUrl: null,
      precoUnitario: 250, quantidade: 2, personalizacao: { tamanho: 'MEDIO',
        acabamento: null, frase: null, nomeFamilia: null, observacoes: null } });
    expect(service.quantidade()).toBe(2); expect(service.subtotal()).toBe(500);
    expect(JSON.parse(localStorage.getItem('oficina-sao-jose.carrinho') ?? '[]')).toHaveLength(1);
  });

  it('should update quantity and remove an item', () => {
    service.adicionar({ modeloIconeId: 2, nome: 'São José', imagemUrl: null,
      precoUnitario: 250, quantidade: 1, personalizacao: { tamanho: 'PEQUENO',
        acabamento: null, frase: null, nomeFamilia: null, observacoes: null } });
    const key = service.itens()[0].chave;
    service.alterarQuantidade(key, 3); expect(service.subtotal()).toBe(750);
    service.remover(key); expect(service.itens()).toEqual([]);
  });
});
