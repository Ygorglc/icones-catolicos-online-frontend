import { inject, Injectable } from '@angular/core';
import { ApiClientService } from '../../../core/services/api-client.service';
import { AtualizarPerfilClienteRequest, PerfilCliente } from '../models/perfil-cliente.model';
@Injectable({ providedIn: 'root' })
export class PerfilClienteService {
  private readonly api = inject(ApiClientService);
  buscar() { return this.api.get<PerfilCliente>('clientes/me'); }
  atualizar(request: AtualizarPerfilClienteRequest) { return this.api.put<PerfilCliente, AtualizarPerfilClienteRequest>('clientes/me', request); }
}
