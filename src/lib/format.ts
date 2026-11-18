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

type BookLocation = {
  corridor?: string | null;
  shelf?: string | null;
  shelfLevel?: string | null;
};

function withLabel(label: string, value?: string | null): string | null {
  const clean = value?.trim();
  if (!clean) return null;
  return new RegExp(`^${label}`, 'i').test(clean) ? clean : `${label} ${clean}`;
}

/** Localização física do exemplar em texto, ex.: "Corredor C · Estante 1 · Prateleira 2". */
export function formatBookLocation(book?: BookLocation | null): string {
  if (!book) return 'Não informada';

  const parts = [
    withLabel('Corredor', book.corridor),
    withLabel('Estante', book.shelf),
    withLabel('Prateleira', book.shelfLevel),
  ].filter((part): part is string => Boolean(part));

  return parts.length ? parts.join(' · ') : 'Não informada';
}
