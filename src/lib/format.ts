/**
 * Helpers de formatação compartilhados.
 *
 * Datas do sistema sempre são exibidas no fuso de São Paulo para evitar o
 * clássico "um dia antes" causado pela conversão UTC → horário local.
 */

const DATE_TIME_ZONE = 'America/Sao_Paulo';

export function formatDateBR(date: Date | string | null | undefined): string {
  if (!date) return '—';

  const value = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) return '—';

  return value.toLocaleDateString('pt-BR', { timeZone: DATE_TIME_ZONE });
}

export function formatDateTimeBR(date: Date | string | null | undefined): string {
  if (!date) return '—';

  const value = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) return '—';

  return value.toLocaleString('pt-BR', {
    timeZone: DATE_TIME_ZONE,
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
