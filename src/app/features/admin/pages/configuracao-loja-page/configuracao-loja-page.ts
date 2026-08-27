import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-configuracao-loja-page',
  imports: [ReactiveFormsModule],
  templateUrl: './configuracao-loja-page.html',
  styleUrl: './configuracao-loja-page.scss'
})
export class ConfiguracaoLojaPage implements OnInit {
  private readonly service = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly message = signal<string | null>(null);
  protected readonly form = this.fb.nonNullable.group({
    entregaHabilitada: [true],
    chavePix: ['', Validators.maxLength(200)],
    dadosDeposito: ['', Validators.maxLength(1000)]
  });

  ngOnInit(): void {
    this.service.configuracaoLoja().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({ next: (configuracao) => this.form.reset({ entregaHabilitada: configuracao.entregaHabilitada, chavePix: configuracao.chavePix ?? '', dadosDeposito: configuracao.dadosDeposito ?? '' }), error: () => this.message.set('Não foi possível carregar as configurações.') });
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    this.saving.set(true); this.message.set(null);
    this.service.atualizarConfiguracaoLoja({ entregaHabilitada: value.entregaHabilitada, chavePix: value.chavePix.trim() || null, dadosDeposito: value.dadosDeposito.trim() || null })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false)))
      .subscribe({ next: () => this.message.set('Configurações salvas com sucesso.'), error: () => this.message.set('Não foi possível salvar as configurações.') });
  }
}
