import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-confirmar-email-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './confirmar-email-page.html',
  styleUrl: '../auth-page.scss',
})
export class ConfirmarEmailPage {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly loading = signal(false);
  protected readonly success = signal(false);
  protected readonly message = signal('Enviamos um link de confirmação. Verifique sua caixa de entrada e o spam.');
  protected readonly form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]] });

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token && isPlatformBrowser(this.platformId)) this.confirm(token);
  }

  protected resend(): void {
    if (this.form.invalid || this.loading()) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.auth.resendConfirmation(this.form.controls.email.value.trim()).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (response) => this.message.set(response.mensagem),
      error: () => this.message.set('Não foi possível reenviar a confirmação agora.'),
    });
  }

  private confirm(token: string): void {
    this.loading.set(true);
    this.message.set('Confirmando seu e-mail...');
    this.auth.confirmEmail(token).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (response) => { this.success.set(true); this.message.set(response.mensagem); },
      error: () => this.message.set('O link é inválido ou expirou. Solicite uma nova confirmação.'),
    });
  }
}
