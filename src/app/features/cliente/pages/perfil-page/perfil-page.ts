import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { PerfilClienteService } from '../../services/perfil-cliente.service';
import { SenhaService } from '../../../autenticacao/services/senha.service';
import { cepValidator } from '../../../../shared/validators/cep.validator';
import { ESTADOS_BRASIL } from '../../../../shared/data/estados-brasil';

@Component({ selector: 'app-perfil-page', imports: [ReactiveFormsModule], templateUrl: './perfil-page.html', styleUrl: './perfil-page.scss' })
export class PerfilPage implements OnInit {
  private readonly service = inject(PerfilClienteService); private readonly auth = inject(AuthService);
  private readonly senhaService = inject(SenhaService);
  private readonly fb = inject(FormBuilder); private readonly destroyRef = inject(DestroyRef);
  protected readonly loading = signal(true); protected readonly saving = signal(false); protected readonly message = signal<string | null>(null); protected readonly error = signal(false);
  protected readonly estados = ESTADOS_BRASIL;
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    email: [{ value: '', disabled: true }],
    telefone: ['', [Validators.required, Validators.pattern(/^[1-9]{2}9?\d{8}$/)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    cep: ['', [Validators.required, cepValidator]],
    logradouro: ['', [Validators.required, Validators.maxLength(150)]],
    numero: ['', [Validators.required, Validators.maxLength(20)]],
    complemento: ['', Validators.maxLength(100)],
    bairro: ['', [Validators.required, Validators.maxLength(100)]],
    cidade: ['', [Validators.required, Validators.maxLength(100)]],
    uf: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]],
  });
  protected readonly passwordForm = this.fb.nonNullable.group({ senhaAtual: ['', Validators.required], novaSenha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]], confirmacao: ['', Validators.required] });
  ngOnInit(): void { this.load(); }
  protected load(): void { this.loading.set(true); this.error.set(false); this.service.buscar().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false))).subscribe({ next: (p) => this.form.reset({ nome: p.nome, email: p.email, telefone: p.telefone ?? '', cpf: p.cpf ?? '', cep: p.cep ?? '', logradouro: p.logradouro ?? '', numero: p.numero ?? '', complemento: p.complemento ?? '', bairro: p.bairro ?? '', cidade: p.cidade ?? '', uf: p.uf ?? '' }), error: () => this.error.set(true) }); }
  protected save(): void { if (this.form.invalid || this.saving()) { this.form.markAllAsTouched(); return; } const v = this.form.getRawValue(); this.saving.set(true); this.message.set(null); this.service.atualizar({ nome: v.nome.trim(), telefone: v.telefone.trim(), cpf: v.cpf.trim(), cep: v.cep.trim(), logradouro: v.logradouro.trim(), numero: v.numero.trim(), complemento: v.complemento.trim() || null, bairro: v.bairro.trim(), cidade: v.cidade.trim(), uf: v.uf.trim().toUpperCase() }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({ next: (p) => { this.auth.updateSessionName(p.nome); this.form.patchValue({ nome: p.nome, telefone: p.telefone ?? '', cpf: p.cpf ?? '', cep: p.cep ?? '', logradouro: p.logradouro ?? '', numero: p.numero ?? '', complemento: p.complemento ?? '', bairro: p.bairro ?? '', cidade: p.cidade ?? '', uf: p.uf ?? '' }); this.message.set('Dados cadastrais atualizados com sucesso.'); }, error: () => this.message.set('Não foi possível atualizar os dados. Revise CPF, telefone e CEP.') }); }
  protected changePassword(): void { const v = this.passwordForm.getRawValue(); if (this.passwordForm.invalid || v.novaSenha !== v.confirmacao || this.saving()) { this.passwordForm.markAllAsTouched(); this.message.set(v.novaSenha !== v.confirmacao ? 'As novas senhas não coincidem.' : 'Revise os campos da senha.'); return; } this.saving.set(true); this.message.set(null); this.senhaService.alterar(v.senhaAtual, v.novaSenha).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({ next: () => { this.passwordForm.reset(); this.message.set('Senha alterada com sucesso.'); }, error: () => this.message.set('Não foi possível alterar a senha. Confira a senha atual.') }); }
}
