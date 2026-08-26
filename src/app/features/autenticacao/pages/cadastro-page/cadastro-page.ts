import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { cpfValidator } from '../../../../shared/validators/cpf.validator';

@Component({ selector: 'app-cadastro-page', imports: [ReactiveFormsModule, RouterLink], templateUrl: './cadastro-page.html', styleUrl: '../auth-page.scss' })
export class CadastroPage {
  private readonly fb = inject(FormBuilder); private readonly auth = inject(AuthService);
  private readonly router = inject(Router); private readonly destroyRef = inject(DestroyRef);
  protected readonly submitting = signal(false); protected readonly errorMessage = signal<string | null>(null);
  protected readonly passwordMismatch = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirmarSenha: ['', Validators.required],
    telefone: ['', [Validators.required, Validators.pattern(/^[1-9]{2}9?\d{8}$/)]],
    cpf: ['', [Validators.required, cpfValidator]],
  });

  protected submit(): void {
    this.passwordMismatch.set(this.form.controls.senha.value !== this.form.controls.confirmarSenha.value);
    if (this.form.invalid || this.passwordMismatch() || this.submitting()) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue(); this.submitting.set(true); this.errorMessage.set(null);
    this.auth.register({ nome: value.nome.trim(), email: value.email.trim(), senha: value.senha,
      telefone: value.telefone.trim(), cpf: value.cpf.trim() }).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false)),
    ).subscribe({
      next: () => void this.router.navigate(['/confirmar-email'], { queryParams: { enviado: 'true' } }),
      error: (error: HttpErrorResponse) => this.errorMessage.set(
        error.status === 409 ? 'Este e-mail ou CPF já está cadastrado.' : 'Não foi possível criar a conta. Revise os dados.',
      ),
    });
  }
}
