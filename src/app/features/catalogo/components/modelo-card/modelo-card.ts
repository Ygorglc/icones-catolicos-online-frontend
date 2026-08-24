import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModeloIconeResumo } from '../../models/modelo-icone.model';

@Component({
  selector: 'app-modelo-card', imports: [CurrencyPipe, RouterLink],
  templateUrl: './modelo-card.html', styleUrl: './modelo-card.scss',
})
export class ModeloCard {
  readonly modelo = input.required<ModeloIconeResumo>();

  protected useFallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/images/logo-oficina-sao-jose.jpg')) {
      image.src = '/images/logo-oficina-sao-jose.jpg';
    }
  }
}
