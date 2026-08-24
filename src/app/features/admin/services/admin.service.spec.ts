import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService; let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_BASE_URL, useValue: 'http://api.test/api' }] }); service = TestBed.inject(AdminService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('should update an order status', () => { service.atualizarStatus(9, 'EM_PRODUCAO').subscribe(); const req = http.expectOne('http://api.test/api/admin/encomendas/9/status'); expect(req.request.method).toBe('PATCH'); expect(req.request.body).toEqual({ status: 'EM_PRODUCAO' }); req.flush({ id: 9 }); });
  it('should approve an external payment', () => { service.analisarPagamento(4, true).subscribe(); const req = http.expectOne('http://api.test/api/admin/pagamentos/4/analise'); expect(req.request.body.confirmado).toBe(true); req.flush({ id: 4 }); });
  it('should request a financial report with its period', () => { service.relatorio('2026-01-01', '2026-12-31').subscribe(); const req = http.expectOne((r) => r.url === 'http://api.test/api/admin/financeiro/relatorios'); expect(req.request.params.get('inicio')).toBe('2026-01-01'); expect(req.request.params.get('fim')).toBe('2026-12-31'); req.flush({}); });
  it('should create an icon model with devotional content', () => {
    const body = { nome: 'Nossa Senhora', descricao: 'Ícone artesanal', imagemUrl: null,
      precoBase: 300, ativo: true, conteudoDevocional: { historia: 'História', significado: null,
        simbologia: null, oracao: null, ocasiaoPresente: null, cuidados: null } };
    service.criarModelo(body).subscribe(); const req = http.expectOne('http://api.test/api/admin/modelos');
    expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual(body); req.flush({ id: 5 });
  });
  it('should update an existing icon model', () => {
    const body = { nome: 'São José', descricao: 'Descrição atualizada', imagemUrl: null,
      precoBase: 350, ativo: true, conteudoDevocional: null };
    service.atualizarModelo(5, body).subscribe(); const req = http.expectOne('http://api.test/api/admin/modelos/5');
    expect(req.request.method).toBe('PUT'); expect(req.request.body).toEqual(body); req.flush({ id: 5 });
  });
});
