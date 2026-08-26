import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../../core/config/api.config';
import { PerfilClienteService } from './perfil-cliente.service';

describe('PerfilClienteService', () => {
  let service: PerfilClienteService; let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_BASE_URL, useValue: 'http://api.test/api' }] }); service = TestBed.inject(PerfilClienteService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('should load the authenticated client profile', () => { service.buscar().subscribe((profile) => expect(profile.nome).toBe('Maria')); const request = http.expectOne('http://api.test/api/clientes/me'); expect(request.request.method).toBe('GET'); request.flush({ nome: 'Maria' }); });
  it('should update only the authenticated client profile', () => { const body = { nome: 'Maria Silva', telefone: '21999999999', cpf: '52998224725', cep: '20040002', logradouro: 'Rua da Assembleia', numero: '10', complemento: null, bairro: 'Centro', cidade: 'Rio de Janeiro', uf: 'RJ' }; service.atualizar(body).subscribe(); const request = http.expectOne('http://api.test/api/clientes/me'); expect(request.request.method).toBe('PUT'); expect(request.request.body).toEqual(body); request.flush({ nome: 'Maria Silva' }); });
});
