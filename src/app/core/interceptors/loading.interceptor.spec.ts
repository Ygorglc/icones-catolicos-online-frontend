import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  it('should expose loading state while a request is pending', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(withInterceptors([loadingInterceptor])), provideHttpClientTesting()] });
    const client = TestBed.inject(HttpClient); const http = TestBed.inject(HttpTestingController); const loading = TestBed.inject(LoadingService);
    client.get('/resource').subscribe(); expect(loading.isLoading()).toBe(true);
    http.expectOne('/resource').flush({}); expect(loading.isLoading()).toBe(false); http.verify();
  });
});
