import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { CheckoutService } from './checkout.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: 'http://api.test/api' }] });
    service = TestBed.inject(CheckoutService); http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('should create an order with cart items', () => {
    const body = { tipoEntrega: 'RETIRADA' as const, enderecoEntrega: null, observacoes: null,
      itens: [{ modeloIconeId: 3, quantidade: 1, personalizacao: { tamanho: 'MEDIO' as const,
        acabamento: null, frase: null, nomeFamilia: null, observacoes: null } }] };
    service.criarEncomenda(body).subscribe((result) => expect(result.id).toBe(20));
    const request = http.expectOne('http://api.test/api/encomendas');
    expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body);
    request.flush({ id: 20, valorTotal: 300, valorSinal: 90, statusEncomenda: 'AGUARDANDO_PAGAMENTO_SINAL', statusFinanceiro: 'AGUARDANDO_SINAL' });
  });

  it('should register simulated PIX payment', () => {
    service.registrarPagamento(20, 'SINAL', 'PIX').subscribe();
    const request = http.expectOne('http://api.test/api/encomendas/20/pagamentos');
    expect(request.request.body).toEqual({ tipo: 'SINAL', forma: 'PIX', origem: 'SIMULADO_SISTEMA' });
    request.flush({ id: 1, status: 'CONFIRMADO', totalPago: 90, saldoPendente: 210 });
  });

  it('should submit cash as an external payment', () => {
    service.registrarPagamento(20, 'SINAL', 'DINHEIRO').subscribe();
    const request = http.expectOne('http://api.test/api/encomendas/20/pagamentos');
    expect(request.request.body.origem).toBe('EXTERNO_MANUAL'); request.flush({});
  });
});
