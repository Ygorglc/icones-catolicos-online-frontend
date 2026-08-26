import { inject, Injectable } from '@angular/core';
import { ApiClientService } from '../../../core/services/api-client.service';
import { AtualizarPerfilClienteRequest, EnderecoCliente, EnderecoClienteRequest, PerfilCliente } from '../models/perfil-cliente.model';
@Injectable({ providedIn: 'root' })
export class PerfilClienteService {
  private readonly api = inject(ApiClientService);
  buscar() { return this.api.get<PerfilCliente>('clientes/me'); }
  atualizar(request: AtualizarPerfilClienteRequest) { return this.api.put<PerfilCliente, AtualizarPerfilClienteRequest>('clientes/me', request); }
  listarEnderecos() { return this.api.get<EnderecoCliente[]>('clientes/me/enderecos'); }
  criarEndereco(request: EnderecoClienteRequest) { return this.api.post<EnderecoCliente, EnderecoClienteRequest>('clientes/me/enderecos', request); }
  atualizarEndereco(id: number, request: EnderecoClienteRequest) { return this.api.put<EnderecoCliente, EnderecoClienteRequest>(`clientes/me/enderecos/${id}`, request); }
  excluirEndereco(id: number) { return this.api.delete(`clientes/me/enderecos/${id}`); }
}
