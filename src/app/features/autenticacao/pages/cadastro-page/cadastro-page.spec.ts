import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { CadastroPage } from './cadastro-page';

@Component({ template: '' })
class TestTargetPage {}

describe('CadastroPage', () => {
  const auth = { register: vi.fn() };
  beforeEach(async () => { auth.register.mockReset(); auth.register.mockReturnValue(of({ mensagem: 'Verifique seu e-mail.' })); await TestBed.configureTestingModule({ imports: [CadastroPage], providers: [provideRouter([{ path: 'confirmar-email', component: TestTargetPage }]), { provide: AuthService, useValue: auth }] }).compileComponents(); });
  const write = (input: HTMLInputElement, value: string) => { input.value = value; input.dispatchEvent(new Event('input')); };
  it('should reject different passwords', () => { const fixture = TestBed.createComponent(CadastroPage); fixture.detectChanges(); const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>; write(inputs[0], 'Maria Silva'); write(inputs[1], 'maria@teste.com'); write(inputs[2], 'Senha123!'); write(inputs[3], 'Outra123!'); (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit')); fixture.detectChanges(); expect(auth.register).not.toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('As senhas não coincidem'); });
  it('should register without requiring an address', () => { const fixture = TestBed.createComponent(CadastroPage); fixture.detectChanges(); const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>; write(inputs[0], 'Maria Silva'); write(inputs[1], 'maria@teste.com'); write(inputs[2], 'Senha123!'); write(inputs[3], 'Senha123!'); write(inputs[4], '21999999999'); write(inputs[5], '52998224725'); (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit')); expect(auth.register).toHaveBeenCalledWith({ nome: 'Maria Silva', email: 'maria@teste.com', senha: 'Senha123!', telefone: '21999999999', cpf: '52998224725' }); });
});
