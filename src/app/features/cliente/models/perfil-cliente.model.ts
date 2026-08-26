export interface PerfilCliente { usuarioId: number; clienteId: number; nome: string; email: string; telefone: string; cpf: string; }
export interface AtualizarPerfilClienteRequest { nome: string; telefone: string; cpf: string; }
export interface EnderecoCliente { id: number; apelido: string; cep: string; logradouro: string; numero: string; complemento: string | null; bairro: string; cidade: string; uf: string; principal: boolean; }
export type EnderecoClienteRequest = Omit<EnderecoCliente, 'id'>;
