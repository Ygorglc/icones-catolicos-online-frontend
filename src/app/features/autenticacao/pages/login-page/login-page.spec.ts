import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { LoginPage } from './login-page';

@Component({ template: '' })
class TestTargetPage {}

describe('LoginPage', () => {
  const auth = { login: vi.fn() };
  beforeEach(async () => { auth.login.mockReset(); auth.login.mockReturnValue(of({ token: 'jwt', tipo: 'Bearer', expiraEmSegundos: 3600, usuarioId: 1, nome: 'Cliente', email: 'cliente@teste.com', perfil: 'CLIENTE' })); await TestBed.configureTestingModule({ imports: [LoginPage], providers: [provideRouter([{ path: '', component: TestTargetPage }]), { provide: AuthService, useValue: auth }] }).compileComponents(); });
  const write = (input: HTMLInputElement, value: string) => { input.value = value; input.dispatchEvent(new Event('input')); };
  it('should not submit an invalid form', () => { const fixture = TestBed.createComponent(LoginPage); fixture.detectChanges(); (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit')); expect(auth.login).not.toHaveBeenCalled(); });
  it('should submit email and password', () => { const fixture = TestBed.createComponent(LoginPage); fixture.detectChanges(); const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>; write(inputs[0], 'cliente@teste.com'); write(inputs[1], 'Senha123!'); (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit')); expect(auth.login).toHaveBeenCalledWith({ email: 'cliente@teste.com', senha: 'Senha123!' }); });
});
