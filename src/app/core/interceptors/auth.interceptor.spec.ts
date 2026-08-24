import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';
import { API_BASE_URL } from '../config/api.config';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test/api' },
        { provide: AuthService, useValue: { getToken: () => 'jwt-token' } },
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should attach the token to backend requests', () => {
    client.get('http://api.test/api/cliente/encomendas').subscribe();
    const request = http.expectOne('http://api.test/api/cliente/encomendas');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush([]);
  });

  it('should not expose the token to external addresses', () => {
    client.get('https://example.com/image.jpg').subscribe();
    const request = http.expectOne('https://example.com/image.jpg');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush('');
  });
});
