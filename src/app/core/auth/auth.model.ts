export type UserRole = 'CLIENTE' | 'ADMINISTRADOR';

export interface LoginRequest { email: string; senha: string; }
export interface RegistrationRequest {
  nome: string; email: string; senha: string; telefone: string | null;
  cpf: string | null; endereco: string | null;
}
export interface AuthenticationResponse {
  token: string; tipo: string; expiraEmSegundos: number; usuarioId: number;
  nome: string; email: string; perfil: UserRole;
}
export interface AuthSession extends AuthenticationResponse { expiresAt: number; }
