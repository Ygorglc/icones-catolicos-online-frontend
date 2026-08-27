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
    request.flush({ id: 20, valorTotal: 300, valorSinal: 90, statusEncomenda: 'AGUARDANDO_PAGAMENTO_INICIAL', statusFinanceiro: 'AGUARDANDO_SINAL' });
  });

  it('should load checkout settings', () => {
    service.configuracao().subscribe((config) => expect(config.entregaHabilitada).toBe(false));
    const request = http.expectOne('http://api.test/api/publico/configuracao-loja');
    expect(request.request.method).toBe('GET');
    request.flush({ entregaHabilitada: false, chavePix: 'pix@teste.local', dadosDeposito: 'Banco Teste' });
  });

  it('should submit PIX for administrative confirmation', () => {
    service.registrarPagamento(20, 'SINAL', 'PIX').subscribe();
    const request = http.expectOne('http://api.test/api/encomendas/20/pagamentos');
    expect(request.request.body).toEqual({ tipo: 'SINAL', forma: 'PIX', origem: 'EXTERNO_MANUAL' });
    request.flush({ id: 1, status: 'PENDENTE', totalPago: 0, saldoPendente: 300 });
  });

  it('should submit cash as an external payment', () => {
    service.registrarPagamento(20, 'SINAL', 'DINHEIRO').subscribe();
    const request = http.expectOne('http://api.test/api/encomendas/20/pagamentos');
    expect(request.request.body.origem).toBe('EXTERNO_MANUAL'); request.flush({});
  });

  it('should submit a deposit as an external payment', () => {
    service.registrarPagamento(20, 'INTEGRAL', 'DEPOSITO').subscribe();
    const request = http.expectOne('http://api.test/api/encomendas/20/pagamentos');
    expect(request.request.body).toEqual({ tipo: 'INTEGRAL', forma: 'DEPOSITO', origem: 'EXTERNO_MANUAL' });
    request.flush({});
  });
});
