import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({ selector: 'app-login-page', imports: [ReactiveFormsModule, RouterLink], templateUrl: './login-page.html', styleUrl: '../auth-page.scss' })
export class LoginPage {
  private readonly fb = inject(FormBuilder); private readonly auth = inject(AuthService);
  private readonly router = inject(Router); private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly submitting = signal(false); protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]], senha: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting()) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true); this.errorMessage.set(null);
    this.auth.login(this.form.getRawValue()).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false)),
    ).subscribe({
      next: (response) => {
        const requested = this.route.snapshot.queryParamMap.get('returnUrl');
        const safeReturnUrl = requested?.startsWith('/') && !requested.startsWith('//') ? requested : null;
        const destination = safeReturnUrl ?? (response.perfil === 'ADMINISTRADOR' ? '/admin' : '/cliente/pedidos');
        void this.router.navigateByUrl(destination);
      },
      error: (error: HttpErrorResponse) => this.errorMessage.set(
        error.status === 401 ? 'E-mail ou senha inválidos.' : 'Não foi possível entrar. Tente novamente.',
      ),
    });
  }
}
