import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { adminGuard, clientGuard } from './role.guard';

describe('role guards', () => {
  let role: 'CLIENTE' | 'ADMINISTRADOR' | null;
  beforeEach(() => {
    role = null;
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: {
      isAuthenticated: () => role !== null, hasRole: (expected: string) => role === expected,
    } }] });
  });

  const run = (guard: typeof clientGuard, url: string) => TestBed.runInInjectionContext(
    () => guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));
  const url = (tree: unknown) => TestBed.inject(Router).serializeUrl(tree as UrlTree);

  it('should redirect an anonymous client to login preserving return URL', () => {
    expect(url(run(clientGuard, '/cliente/pedidos'))).toBe('/login?returnUrl=%2Fcliente%2Fpedidos');
  });
  it('should allow a client in the client area', () => { role = 'CLIENTE'; expect(run(clientGuard, '/cliente')).toBe(true); });
  it('should deny the administrative area to clients', () => { role = 'CLIENTE'; expect(url(run(adminGuard, '/admin'))).toBe('/cliente/pedidos'); });
  it('should allow an administrator in the administrative area', () => { role = 'ADMINISTRADOR'; expect(run(adminGuard, '/admin')).toBe(true); });
  it('should redirect administrators away from client-only routes', () => { role = 'ADMINISTRADOR'; expect(url(run(clientGuard, '/checkout'))).toBe('/admin'); });
});
