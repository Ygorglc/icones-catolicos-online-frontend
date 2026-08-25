export interface PerfilCliente { usuarioId: number; clienteId: number; nome: string; email: string; telefone: string | null; cpf: string | null; endereco: string | null; }
export interface AtualizarPerfilClienteRequest { nome: string; telefone: string | null; cpf: string | null; endereco: string | null; }
