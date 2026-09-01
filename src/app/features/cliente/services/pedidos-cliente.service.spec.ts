import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { PedidosClienteService } from './pedidos-cliente.service';

describe('PedidosClienteService', () => {
  let service: PedidosClienteService; let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
    { provide: API_BASE_URL, useValue: 'http://api.test/api' }] }); service = TestBed.inject(PedidosClienteService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());

  it('should list orders from the authenticated client', () => {
    service.listar().subscribe((orders) => expect(orders[0].id).toBe(12));
    const request = http.expectOne('http://api.test/api/encomendas'); expect(request.request.method).toBe('GET');
    request.flush([{ id: 12 }]);
  });

  it('should load order payment history and certificate', () => {
    service.pagamentos(12).subscribe(); service.certificado(12).subscribe();
    http.expectOne('http://api.test/api/encomendas/12/pagamentos').flush({ pagamentos: [] });
    http.expectOne('http://api.test/api/encomendas/12/certificado').flush({ codigoPublico: 'abc' });
  });

  it('should register the remaining payment with the correct origin', () => {
    service.pagar(12, 'RESTANTE', 'DINHEIRO').subscribe();
    const request = http.expectOne('http://api.test/api/encomendas/12/pagamentos');
    expect(request.request.body).toEqual({ tipo: 'RESTANTE', forma: 'DINHEIRO', origem: 'EXTERNO_MANUAL' }); request.flush({});
  });

  it('should register a deposit with external confirmation', () => {
    service.pagar(12, 'RESTANTE', 'DEPOSITO').subscribe();
    const request = http.expectOne('http://api.test/api/encomendas/12/pagamentos');
    expect(request.request.body).toEqual({ tipo: 'RESTANTE', forma: 'DEPOSITO', origem: 'EXTERNO_MANUAL' });
    request.flush({});
  });

  it('should upload and download a payment receipt', () => {
    const file = new File(['%PDF-test'], 'comprovante.pdf', { type: 'application/pdf' });
    service.anexarComprovante(12, 8, file).subscribe();
    const upload = http.expectOne('http://api.test/api/encomendas/12/pagamentos/8/comprovante');
    expect(upload.request.body instanceof FormData).toBe(true); upload.flush({ possuiComprovante: true });
    service.baixarComprovante(12, 8).subscribe();
    const download = http.expectOne('http://api.test/api/encomendas/12/pagamentos/8/comprovante');
    expect(download.request.method).toBe('GET'); expect(download.request.responseType).toBe('blob');
    download.flush(new Blob(['arquivo'], { type: 'application/pdf' }));
  });
});
