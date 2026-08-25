import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../config/api.config';
import { AuthService } from './auth.service';

const SESSION_KEY = 'oficina-sao-jose.auth';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test/api' },
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('should authenticate and persist the JWT session', () => {
    service.login({ email: 'cliente@teste.com', senha: 'Senha123!' }).subscribe();

    const request = http.expectOne('http://api.test/api/auth/login');
    expect(request.request.method).toBe('POST');
    request.flush({
      token: 'jwt-token', tipo: 'Bearer', expiraEmSegundos: 3600, usuarioId: 10,
      nome: 'Cliente Teste', email: 'cliente@teste.com', perfil: 'CLIENTE',
    });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.hasRole('CLIENTE')).toBe(true);
    expect(service.getToken()).toBe('jwt-token');
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}').token).toBe('jwt-token');
  });

  it('should register a client and start their session', () => {
    service.register({ nome: 'Maria', email: 'maria@teste.com', senha: 'Senha123!',
      telefone: null, cpf: null, endereco: null }).subscribe();

    const request = http.expectOne('http://api.test/api/auth/cadastro');
    expect(request.request.method).toBe('POST');
    request.flush({ token: 'new-token', tipo: 'Bearer', expiraEmSegundos: 3600,
      usuarioId: 11, nome: 'Maria', email: 'maria@teste.com', perfil: 'CLIENTE' });

    expect(service.getToken()).toBe('new-token');
    expect(service.role()).toBe('CLIENTE');
  });

  it('should clear the session on logout', () => {
    sessionStorage.setItem(SESSION_KEY, '{"token":"old"}');
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('should update the name stored in the active session', () => {
    service.login({ email: 'cliente@teste.com', senha: 'Senha123!' }).subscribe();
    http.expectOne('http://api.test/api/auth/login').flush({ token: 'jwt', tipo: 'Bearer',
      expiraEmSegundos: 3600, usuarioId: 1, nome: 'Nome antigo', email: 'cliente@teste.com', perfil: 'CLIENTE' });
    service.updateSessionName('Nome atualizado');
    expect(service.session()?.nome).toBe('Nome atualizado');
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}').nome).toBe('Nome atualizado');
  });
});
