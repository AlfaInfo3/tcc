import { createHash } from 'crypto';
import { Prisma, type Student } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Identidade canônica de um aluno.
 *
 * Unifica caixa, acentos, espaços repetidos e as variantes de ordinal (º/°)
 * para que "João  Silva", "JOÃO SILVA" e "Joao Silva" apontem para o mesmo
 * cadastro. Também é usada na mesclagem de duplicatas (scripts/).
 */
export function normalizeIdentity(value: string): string {
  return (value || '')
    .replace(/[ºª°]/g, (char) => (char === 'ª' ? 'a' : 'o'))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Código determinístico: o mesmo nome + turma sempre gera o mesmo valor. */
export function buildStudentCodeHash(name: string, className: string): string {
  return createHash('sha256')
    .update(`${normalizeIdentity(name)}|${normalizeIdentity(className)}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Localiza um aluno existente ou cria um novo, de forma atômica.
 *
 * A transação serializável evita a corrida em que duas requisições paralelas
 * passam pelo `findFirst` e criam dois registros idênticos (TOCTOU).
 * Também reconhece registros legados com `normalizedName` nulo.
 */
export async function findOrCreateStudent(
  name: string,
  className: string
): Promise<{ student: Student; created: boolean }> {
  const normalizedName = normalizeIdentity(name);
  const cleanName = name.trim();
  const cleanClass = className.trim();
  const codeHash = buildStudentCodeHash(cleanName, cleanClass);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const existing = await tx.student.findFirst({
            where: {
              OR: [
                { codeHash },
                {
                  normalizedName,
                  class: { equals: cleanClass, mode: 'insensitive' },
                },
                {
                  normalizedName: null,
                  name: { equals: cleanName, mode: 'insensitive' },
                  class: { equals: cleanClass, mode: 'insensitive' },
                },
              ],
            },
            orderBy: { createdAt: 'asc' },
          });

          if (existing) {
            // Repara registros antigos para que passem a ser encontrados sempre.
            if (existing.normalizedName !== normalizedName || existing.codeHash !== codeHash) {
              const updated = await tx.student.update({
                where: { id: existing.id },
                data: { normalizedName, codeHash },
              });
              return { student: updated, created: false };
            }
            return { student: existing, created: false };
          }

          const created = await tx.student.create({
            data: {
              name: cleanName,
              class: cleanClass,
              normalizedName,
              codeHash,
            },
          });
          return { student: created, created: true };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
    } catch (error) {
      const isWriteConflict =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';
      if (!isWriteConflict || attempt === 2) throw error;
    }
  }

  throw new Error('Não foi possível resolver o cadastro do aluno.');
}
