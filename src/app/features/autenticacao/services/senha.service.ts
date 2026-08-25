import { inject, Injectable } from '@angular/core';
import { ApiClientService } from '../../../core/services/api-client.service';
export interface RecuperacaoResponse { mensagem: string; expiraEmMinutos: number; }
@Injectable({ providedIn: 'root' })
export class SenhaService {
  private readonly api = inject(ApiClientService);
  solicitarRecuperacao(email: string) { return this.api.post<RecuperacaoResponse, object>('auth/senha/recuperacao', { email }); }
  redefinir(token: string, novaSenha: string) { return this.api.post<void, object>('auth/senha/redefinicao', { token, novaSenha }); }
  alterar(senhaAtual: string, novaSenha: string) { return this.api.put<void, object>('clientes/me/senha', { senhaAtual, novaSenha }); }
}
