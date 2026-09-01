const labels: Record<string, string> = {
  ENCOMENDA_CRIADA: 'Encomenda criada', AGUARDANDO_PAGAMENTO_INICIAL: 'Aguardando confirmação de pagamento inicial', SINAL_PAGO: 'Sinal pago',
  EM_PRODUCAO: 'Em produção', AGUARDANDO_PAGAMENTO_RESTANTE: 'Aguardando pagamento restante',
  ENVIADO_OU_RETIRADO: 'Enviado ou aguardando retirada', ENTREGUE_E_CONCLUIDO: 'Entregue e concluído', CANCELADO: 'Cancelado',
  AGUARDANDO_SINAL: 'Aguardando sinal', PAGAMENTO_PARCIAL: 'Pagamento parcial', AGUARDANDO_RESTANTE: 'Aguardando restante',
  PAGO_INTEGRALMENTE: 'Pago integralmente', REEMBOLSADO: 'Reembolsado', CONFIRMADO: 'Confirmado', PENDENTE: 'Pendente',
  PIX: 'PIX', DINHEIRO: 'Dinheiro', DEPOSITO: 'Depósito',
  SINAL: 'Sinal', RESTANTE: 'Restante', INTEGRAL: 'Integral',
};
export const pedidoLabel = (value: string | null | undefined) => value ? labels[value] ?? value.replaceAll('_', ' ') : '—';
