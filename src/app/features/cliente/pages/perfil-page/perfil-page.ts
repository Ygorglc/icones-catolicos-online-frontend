import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { PerfilClienteService } from '../../services/perfil-cliente.service';

@Component({ selector: 'app-perfil-page', imports: [ReactiveFormsModule], templateUrl: './perfil-page.html', styleUrl: './perfil-page.scss' })
export class PerfilPage implements OnInit {
  private readonly service = inject(PerfilClienteService); private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder); private readonly destroyRef = inject(DestroyRef);
  protected readonly loading = signal(true); protected readonly saving = signal(false); protected readonly message = signal<string | null>(null); protected readonly error = signal(false);
  protected readonly form = this.fb.nonNullable.group({ nome: ['', [Validators.required, Validators.maxLength(120)]], email: [{ value: '', disabled: true }], telefone: ['', Validators.maxLength(20)], cpf: ['', Validators.pattern(/^$|^\d{11}$/)], endereco: ['', Validators.maxLength(2000)] });
  ngOnInit(): void { this.load(); }
  protected load(): void { this.loading.set(true); this.error.set(false); this.service.buscar().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false))).subscribe({ next: (p) => this.form.reset({ nome: p.nome, email: p.email, telefone: p.telefone ?? '', cpf: p.cpf ?? '', endereco: p.endereco ?? '' }), error: () => this.error.set(true) }); }
  protected save(): void { if (this.form.invalid || this.saving()) { this.form.markAllAsTouched(); return; } const v = this.form.getRawValue(); const optional = (text: string) => text.trim() || null; this.saving.set(true); this.message.set(null); this.service.atualizar({ nome: v.nome.trim(), telefone: optional(v.telefone), cpf: optional(v.cpf), endereco: optional(v.endereco) }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({ next: (p) => { this.auth.updateSessionName(p.nome); this.form.patchValue({ nome: p.nome, telefone: p.telefone ?? '', cpf: p.cpf ?? '', endereco: p.endereco ?? '' }); this.message.set('Dados cadastrais atualizados com sucesso.'); }, error: () => this.message.set('Não foi possível atualizar os dados. Verifique se o CPF já está cadastrado.') }); }
}
