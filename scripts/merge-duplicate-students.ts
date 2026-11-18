/**
 * Mescla alunos duplicados (mesmo nome e mesma turma normalizados).
 *
 * Uso:
 *   npx tsx scripts/merge-duplicate-students.ts            # somente simulação
 *   npx tsx scripts/merge-duplicate-students.ts --apply    # aplica a mesclagem
 *
 * O modo padrão é somente leitura. Antes de aplicar, faça um backup lógico.
 */
import { Prisma, type Student, type StudentProfile } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import { normalizeIdentity, buildStudentCodeHash } from '../src/lib/students';

type Group = {
  key: string;
  students: Array<
    Student & {
      _count: { loans: number; reservations: number };
      profile: (StudentProfile & { badges: { badgeId: string }[] }) | null;
    }
  >;
};

const apply = process.argv.includes('--apply');

function normalizeClass(value: string) {
  return normalizeIdentity(value);
}

async function loadGroups(): Promise<Group[]> {
  const students = await prisma.student.findMany({
    include: {
      _count: { select: { loans: true, reservations: true } },
      profile: { include: { badges: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const byKey = new Map<string, Group['students']>();
  for (const student of students) {
    const key = `${normalizeIdentity(student.name)}|${normalizeClass(student.class)}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(student);
  }

  return [...byKey.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([key, list]) => ({ key, students: list }));
}

/** Escolhe o sobrevivente: perfil gamificado > mais histórico > mais antigo. */
function pickTarget(list: Group['students']) {
  return [...list].sort((a, b) => {
    const profileDiff = Number(!!b.profile) - Number(!!a.profile);
    if (profileDiff) return profileDiff;
    const historyDiff =
      b._count.loans + b._count.reservations - (a._count.loans + a._count.reservations);
    if (historyDiff) return historyDiff;
    return a.createdAt.getTime() - b.createdAt.getTime();
  })[0];
}

async function mergeGroup(group: Group) {
  const target = pickTarget(group.students);
  const sources = group.students.filter((student) => student.id !== target.id);
  const sourceIds = sources.map((student) => student.id);
  const canonicalName = target.name.trim();
  const canonicalClass = target.class.trim();

  if (!apply) {
    console.log(
      `  manter ${target.id} (${target.name} / ${target.class}) · remover: ${sourceIds.join(', ')}`
    );
    return;
  }

  await prisma.$transaction(async (tx) => {
    // 1. Reatribui o histórico antes de apagar os alunos (FK ON DELETE RESTRICT).
    await tx.loan.updateMany({
      where: { studentId: { in: sourceIds } },
      data: { studentId: target.id },
    });
    await tx.reservation.updateMany({
      where: { studentId: { in: sourceIds } },
      data: { studentId: target.id },
    });

    // 2. Unifica perfis gamificados.
    const profiles = group.students
      .map((student) => student.profile)
      .filter((profile): profile is NonNullable<Group['students'][number]['profile']> => !!profile);

    if (profiles.length > 1) {
      const keeper =
        profiles.find((profile) => profile.studentId === target.id) ??
        [...profiles].sort((a, b) => b.xp - a.xp)[0];
      const losers = profiles.filter((profile) => profile.id !== keeper.id);

      for (const loser of losers) {
        await tx.studentBadge.createMany({
          data: loser.badges.map((badge) => ({ profileId: keeper.id, badgeId: badge.badgeId })),
          skipDuplicates: true,
        });
        await tx.studentBadge.deleteMany({ where: { profileId: loser.id } });
        await tx.studentProfile.delete({ where: { id: loser.id } });
      }

      const otherXp = losers.reduce((sum, profile) => sum + profile.xp, 0);
      await tx.studentProfile.update({
        where: { id: keeper.id },
        data: {
          xp: keeper.xp + otherXp,
          level: Math.max(...profiles.map((profile) => profile.level)),
          streak: Math.max(...profiles.map((profile) => profile.streak)),
        },
      });
    } else if (profiles.length === 1 && profiles[0].studentId !== target.id) {
      await tx.studentProfile.update({
        where: { id: profiles[0].id },
        data: { studentId: target.id },
      });
    }

    // 3. Remove os duplicados por último.
    await tx.student.deleteMany({ where: { id: { in: sourceIds } } });

    // 4. Canoniza o registro restante.
    await tx.student.update({
      where: { id: target.id },
      data: {
        name: canonicalName,
        class: canonicalClass,
        normalizedName: normalizeIdentity(canonicalName),
        codeHash: buildStudentCodeHash(canonicalName, canonicalClass),
      },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

async function main() {
  const groups = await loadGroups();
  console.log(
    `${apply ? 'APLICANDO' : 'SIMULANDO'} · ${groups.length} grupo(s) de duplicatas`
  );

  for (const group of groups) {
    console.log(`\n${group.key} (${group.students.length} cadastros)`);
    await mergeGroup(group);
  }

  if (!apply && groups.length) {
    console.log('\nPara aplicar, rode com --apply após fazer backup do banco.');
  }
}

main()
  .catch((error) => {
    console.error('Falha ao processar duplicatas:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
