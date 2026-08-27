const labels: Record<string, string> = {
  ENCOMENDA_CRIADA: 'Encomenda criada', AGUARDANDO_PAGAMENTO_INICIAL: 'Aguardando pagamento inicial', PAGAMENTO_INICIAL_CONFIRMADO: 'Pagamento inicial confirmado', SINAL_PAGO: 'Sinal pago',
  PRODUCAO_LIBERADA: 'Produção liberada', EM_PRODUCAO: 'Em produção', EM_ACABAMENTO: 'Em acabamento',
  PRONTO_PARA_ENTREGA_RETIRADA: 'Pronto para entrega ou retirada', AGUARDANDO_PAGAMENTO_RESTANTE: 'Aguardando pagamento restante',
  ENVIADO_OU_RETIRADO: 'Enviado ou retirado', CONCLUIDO: 'Concluído', CANCELADO: 'Cancelado',
  AGUARDANDO_SINAL: 'Aguardando sinal', PAGAMENTO_PARCIAL: 'Pagamento parcial', AGUARDANDO_RESTANTE: 'Aguardando restante',
  PAGO_INTEGRALMENTE: 'Pago integralmente', REEMBOLSADO: 'Reembolsado', CONFIRMADO: 'Confirmado', PENDENTE: 'Pendente',
  PIX: 'PIX', DINHEIRO: 'Dinheiro', DEPOSITO: 'Depósito',
  SINAL: 'Sinal', RESTANTE: 'Restante', INTEGRAL: 'Integral',
};
export const pedidoLabel = (value: string | null | undefined) => value ? labels[value] ?? value.replaceAll('_', ' ') : '—';
