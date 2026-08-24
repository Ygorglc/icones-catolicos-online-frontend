import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiErrorService } from '../services/api-error.service';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  it('should publish the standardized backend error', () => {
    const errorService = { show: vi.fn() };
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([apiErrorInterceptor])), provideHttpClientTesting(), { provide: ApiErrorService, useValue: errorService }] });
    const client = TestBed.inject(HttpClient); const http = TestBed.inject(HttpTestingController);
    client.get('/resource').subscribe({ error: () => undefined });
    http.expectOne('/resource').flush({ erro: 'Regra de negócio', mensagem: 'Operação inválida.', campos: [] }, { status: 422, statusText: 'Unprocessable Entity' });
    expect(errorService.show).toHaveBeenCalledWith({ status: 422, title: 'Regra de negócio', message: 'Operação inválida.', fields: [] }); http.verify();
  });
  it('should explain connection failures', () => {
    const errorService = { show: vi.fn() };
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([apiErrorInterceptor])), provideHttpClientTesting(), { provide: ApiErrorService, useValue: errorService }] });
    const client = TestBed.inject(HttpClient); const http = TestBed.inject(HttpTestingController);
    client.get('/offline').subscribe({ error: () => undefined }); http.expectOne('/offline').error(new ProgressEvent('error'));
    expect(errorService.show.mock.calls[0][0].message).toContain('conectar ao servidor'); http.verify();
  });
});
