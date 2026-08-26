import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiClientService } from '../services/api-client.service';
import { AuthenticationResponse, AuthSession, LoginRequest, MessageResponse, RegistrationRequest, RegistrationResponse, UserRole } from './auth.model';

const SESSION_KEY = 'oficina-sao-jose.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sessionState = signal<AuthSession | null>(null);
  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionState() !== null);
  readonly role = computed(() => this.sessionState()?.perfil ?? null);

  constructor() { if (isPlatformBrowser(this.platformId)) this.restore(); }

  login(request: LoginRequest): Observable<AuthenticationResponse> {
    return this.api.post<AuthenticationResponse, LoginRequest>('auth/login', request)
      .pipe(tap((response) => this.store(response)));
  }

  register(request: RegistrationRequest): Observable<RegistrationResponse> {
    return this.api.post<RegistrationResponse, RegistrationRequest>('auth/cadastro', request);
  }

  confirmEmail(token: string): Observable<MessageResponse> {
    return this.api.post<MessageResponse, object>('auth/email/confirmacao', { token });
  }

  resendConfirmation(email: string): Observable<MessageResponse> {
    return this.api.post<MessageResponse, object>('auth/email/confirmacao/reenviar', { email });
  }

  logout(): void {
    this.sessionState.set(null);
    if (isPlatformBrowser(this.platformId)) sessionStorage.removeItem(SESSION_KEY);
  }

  hasRole(role: UserRole): boolean { return this.role() === role; }
  getToken(): string | null { return this.sessionState()?.token ?? null; }

  updateSessionName(nome: string): void {
    const current = this.sessionState();
    if (!current) return;
    const updated = { ...current, nome };
    this.sessionState.set(updated);
    if (isPlatformBrowser(this.platformId)) sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }

  private store(response: AuthenticationResponse): void {
    const session: AuthSession = { ...response, expiresAt: Date.now() + response.expiraEmSegundos * 1000 };
    this.sessionState.set(session);
    if (isPlatformBrowser(this.platformId)) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private restore(): void {
    try {
      const value = sessionStorage.getItem(SESSION_KEY);
      if (!value) return;
      const session = JSON.parse(value) as AuthSession;
      if (!session.token || session.expiresAt <= Date.now()) { this.logout(); return; }
      this.sessionState.set(session);
    } catch { this.logout(); }
  }
}
