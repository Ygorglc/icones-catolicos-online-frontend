import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiClientService } from '../../../core/services/api-client.service';
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
  let service: CarrinhoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [
      { provide: AuthService, useValue: { session: signal(null).asReadonly() } },
      { provide: ApiClientService, useValue: {} },
    ] });
    service = TestBed.inject(CarrinhoService);
  });

  afterEach(() => localStorage.clear());

  it('should add items and calculate estimated subtotal', () => {
    service.adicionar({ modeloIconeId: 2, nome: 'São José', imagemUrl: null,
      precoUnitario: 250, quantidade: 2, personalizacao: { tamanho: 'MEDIO',
        acabamento: null, frase: null, nomeFamilia: null, observacoes: null } });
    expect(service.quantidade()).toBe(2); expect(service.subtotal()).toBe(500);
    expect(JSON.parse(localStorage.getItem('oficina-sao-jose.carrinho.visitante') ?? '[]')).toHaveLength(1);
  });

  it('should update quantity and remove an item', () => {
    service.adicionar({ modeloIconeId: 2, nome: 'São José', imagemUrl: null,
      precoUnitario: 250, quantidade: 1, personalizacao: { tamanho: 'PEQUENO',
        acabamento: null, frase: null, nomeFamilia: null, observacoes: null } });
    const key = service.itens()[0].chave;
    service.alterarQuantidade(key, 3); expect(service.subtotal()).toBe(750);
    service.remover(key); expect(service.itens()).toEqual([]);
  });

  it('should ignore invalid quantities', () => {
    service.adicionar({ modeloIconeId: 2, nome: 'São José', imagemUrl: null,
      precoUnitario: 250, quantidade: 1, personalizacao: { tamanho: 'MEDIO',
        acabamento: null, frase: null, nomeFamilia: null, observacoes: null } });
    service.alterarQuantidade(service.itens()[0].chave, 0);
    expect(service.quantidade()).toBe(1);
  });
});
