import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ModeloCard } from '../../components/modelo-card/modelo-card';
import { ModeloIconeResumo } from '../../models/modelo-icone.model';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  selector: 'app-catalogo-page', imports: [FormsModule, ModeloCard],
  templateUrl: './catalogo-page.html', styleUrl: './catalogo-page.scss',
})
export class CatalogoPage implements OnInit {
  private readonly catalogoService = inject(CatalogoService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly modelos = signal<ModeloIconeResumo[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly search = signal('');
  protected readonly filteredModels = computed(() => {
    const term = normalize(this.search());
    return term ? this.modelos().filter((modelo) => normalize(modelo.nome).includes(term)) : this.modelos();
  });

  ngOnInit(): void { this.loadModels(); }

  protected loadModels(): void {
    this.loading.set(true); this.failed.set(false);
    this.catalogoService.listarModelos().pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)),
    ).subscribe({ next: (modelos) => this.modelos.set(modelos), error: () => this.failed.set(true) });
  }
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
