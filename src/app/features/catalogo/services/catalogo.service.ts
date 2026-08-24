import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/services/api-client.service';
import { ModeloIconeDetalhe, ModeloIconeResumo } from '../models/modelo-icone.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly api = inject(ApiClientService);

  listarModelos(): Observable<ModeloIconeResumo[]> {
    return this.api.get<ModeloIconeResumo[]>('publico/modelos');
  }

  buscarModelo(id: number): Observable<ModeloIconeDetalhe> {
    return this.api.get<ModeloIconeDetalhe>(`publico/modelos/${id}`);
  }
}
