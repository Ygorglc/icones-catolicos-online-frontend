import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { CatalogoService } from './catalogo.service';

describe('CatalogoService', () => {
  let service: CatalogoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test/api' },
      ],
    });
    service = TestBed.inject(CatalogoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should list active icon models', () => {
    service.listarModelos().subscribe((models) => expect(models[0].nome).toBe('São José'));
    const request = http.expectOne('http://api.test/api/publico/modelos');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 1, nome: 'São José', imagemUrl: null, precoBase: 280 }]);
  });

  it('should load an icon model with devotional content', () => {
    service.buscarModelo(7).subscribe((model) => expect(model.conteudoDevocional?.oracao).toBe('Rogai por nós.'));
    const request = http.expectOne('http://api.test/api/publico/modelos/7');
    expect(request.request.method).toBe('GET');
    request.flush({
      id: 7, nome: 'São José', descricao: 'Ícone artesanal', imagemUrl: null,
      precoBase: 300, ativo: true, criadoEm: '2026-08-24T12:00:00Z',
      conteudoDevocional: { id: 2, historia: null, significado: null, simbologia: null,
        oracao: 'Rogai por nós.', ocasiaoPresente: null, cuidados: null },
    });
  });
});
