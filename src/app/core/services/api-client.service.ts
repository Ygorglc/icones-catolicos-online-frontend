import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.url(path), { params });
  }
  getBlob(path: string): Observable<Blob> { return this.http.get(this.url(path), { responseType: 'blob' }); }
  post<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.url(path), body);
  }
  put<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.put<TResponse>(this.url(path), body);
  }
  patch<TResponse, TBody = unknown>(path: string, body: TBody): Observable<TResponse> {
    return this.http.patch<TResponse>(this.url(path), body);
  }
  delete(path: string): Observable<void> { return this.http.delete<void>(this.url(path)); }
  private url(path: string): string { return `${this.baseUrl}/${path.replace(/^\//, '')}`; }
}
