import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-api';
import { hashPassword } from '@/lib/password';
import { findOrCreateStudent, normalizeIdentity, buildStudentCodeHash } from '@/lib/students';

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, class: className, username, password } = await request.json();

    if (!name || !className) {
        return NextResponse.json({ error: 'Nome e Turma são obrigatórios' }, { status: 400 });
    }

    // 1. If username provided, check availability first
    if (username) {
        const existingProfile = await prisma.studentProfile.findUnique({
             where: { username }
        });
        if (existingProfile) {
            return NextResponse.json({ error: 'Nome de usuário já está em uso.' }, { status: 409 });
        }
    }

    const { student, created } = await findOrCreateStudent(name, className);

    if (!created) {
        return NextResponse.json({
            error: 'Aluno já cadastrado nesta turma',
            student
        }, { status: 409 });
    }

    // 4. Create Profile (if requested)
    if (username && password) {
         await prisma.studentProfile.create({
             data: {
                 studentId: student.id,
                 username,
                 password: await hashPassword(password),
                 xp: 0,
                 level: 1
             }
         });
    }

    return NextResponse.json(student);

  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: 'Erro ao criar aluno' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    const session = await requireAdmin(request);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, name, class: className, username, password } = await request.json();
    
        if (!id || !name || !className) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }
    
        const cleanName = name.trim();
        const cleanClass = className.trim();

        await prisma.student.update({
            where: { id },
            data: {
                name: cleanName,
                class: cleanClass,
                normalizedName: normalizeIdentity(cleanName),
                codeHash: buildStudentCodeHash(cleanName, cleanClass)
            }
        });

        // Optional profile maintenance: change username and/or reset password.
        if (username || password) {
            const profile = await prisma.studentProfile.findUnique({
                where: { studentId: id }
            });

            if (profile) {
                const profileData: { username?: string; password?: string } = {};

                if (username && username !== profile.username) {
                    const existingUsername = await prisma.studentProfile.findUnique({
                        where: { username }
                    });
                    if (existingUsername && existingUsername.id !== profile.id) {
                        return NextResponse.json(
                            { error: 'Nome de usuário já está em uso.' },
                            { status: 409 }
                        );
                    }
                    profileData.username = username;
                }

                if (password) {
                    if (typeof password !== 'string' || password.length < 6) {
                        return NextResponse.json(
                            { error: 'A senha deve ter pelo menos 6 caracteres.' },
                            { status: 400 }
                        );
                    }
                    profileData.password = await hashPassword(password);
                }

                if (Object.keys(profileData).length > 0) {
                    await prisma.studentProfile.update({
                        where: { id: profile.id },
                        data: profileData
                    });
                }
            } else if (username && password) {
                await prisma.studentProfile.create({
                    data: {
                        studentId: id,
                        username,
                        password: await hashPassword(password),
                        xp: 0,
                        level: 1
                    }
                });
            }
        }
    
        return NextResponse.json({ success: true });
    
      } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
      }
}
