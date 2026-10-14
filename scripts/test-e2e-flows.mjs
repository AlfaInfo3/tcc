import { PrismaClient } from '@prisma/client';

const BASE_URL = 'http://localhost:3002';
const prisma = new PrismaClient();

const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

async function test(name, fn) {
  try {
    await fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: err.message });
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Reason: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🚀 INICIANDO BATERIA DE TESTES DE FLUXO DO SISTEMA');
  console.log(`🌐 Alvo: ${BASE_URL}`);
  console.log('======================================================\n');

  let adminCookie = '';
  let studentCookie = '';
  let testBookId = null;
  let testStudentId = null;
  let testLoanId = null;
  let testReservationId = null;

  // ------------------------------------------------------------------
  // 1. FLUXO PÚBLICO E NAVEGAÇÃO
  // ------------------------------------------------------------------
  console.log('\n📌 [1/7] Testando Páginas Públicas e Institucionais...');

  await test('Página Inicial (Landing Page /)', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const text = await res.text();
    assert(text.includes('Biblioteca') || text.includes('Laurentino') || text.includes('html'), 'Conteúdo da landing não encontrado');
  });

  await test('Página de Livros /livros', async () => {
    const res = await fetch(`${BASE_URL}/livros`);
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
  });

  await test('Página de Reserva /reservar', async () => {
    const res = await fetch(`${BASE_URL}/reservar`);
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
  });

  await test('Página Institucional /sobre', async () => {
    const res = await fetch(`${BASE_URL}/sobre`);
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
  });

  await test('Página Institucional /contato', async () => {
    const res = await fetch(`${BASE_URL}/contato`);
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
  });

  await test('Página Institucional /matriculas', async () => {
    const res = await fetch(`${BASE_URL}/matriculas`);
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
  });

  // ------------------------------------------------------------------
  // 2. APIS PÚBLICAS DO ACERVO
  // ------------------------------------------------------------------
  console.log('\n📌 [2/7] Testando APIs Públicas de Consulta...');

  await test('API GET /api/genres', async () => {
    const res = await fetch(`${BASE_URL}/api/genres`);
    assert(res.status === 200, `Status incorreto: ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data), 'Esperado array de gêneros');
  });

  await test('API GET /api/livros/list', async () => {
    const res = await fetch(`${BASE_URL}/api/livros/list`);
    assert(res.status === 200, `Status incorreto: ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.books || data), 'Esperado lista de livros');
    const books = Array.isArray(data) ? data : data.books;
    if (books.length > 0) {
      testBookId = books[0].id;
    }
  });

  await test('API GET /api/livros/search-local com busca vazia e termo', async () => {
    const resEmpty = await fetch(`${BASE_URL}/api/livros/search-local?q=`);
    assert(resEmpty.status === 200, `Status busca vazia: ${resEmpty.status}`);
    const resTerm = await fetch(`${BASE_URL}/api/livros/search-local?q=a`);
    assert(resTerm.status === 200, `Status busca termo: ${resTerm.status}`);
  });

  // ------------------------------------------------------------------
  // 3. SEGURANÇA E PROTEÇÃO DO MIDDLEWARE
  // ------------------------------------------------------------------
  console.log('\n📌 [3/7] Testando Segurança e Middleware de Rotas Protegidas...');

  await test('Bloqueio de rota Admin /admin sem autenticação (deve redirecionar)', async () => {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' });
    assert(res.status === 307 || res.status === 302, `Esperado redirect (307/302), recebido ${res.status}`);
    assert(res.headers.get('location')?.includes('/admin/auth'), 'Redirecionamento não apontou para /admin/auth');
  });

  await test('Bloqueio de /admin/dashboard sem token', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, { redirect: 'manual' });
    assert(res.status === 307 || res.status === 302, `Esperado redirect, recebido ${res.status}`);
  });

  await test('Bloqueio de API /api/admin/users sem token (401 Unauthorized)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/users`);
    assert(res.status === 401, `Esperado 401, recebido ${res.status}`);
  });

  // ------------------------------------------------------------------
  // 4. FLUXO DE AUTENTICAÇÃO DO ADMINISTRADOR
  // ------------------------------------------------------------------
  console.log('\n📌 [4/7] Testando Autenticação e Sessão de Administrador...');

  await test('POST /api/auth/login com payload vazio rejeitado (400)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(res.status === 400, `Esperado 400, recebido ${res.status}`);
  });

  await test('POST /api/auth/login com credenciais inválidas rejeitado (401)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@admin.com', password: 'senha-totalmente-errada' })
    });
    assert(res.status === 401, `Esperado 401, recebido ${res.status}`);
  });

  await test('POST /api/auth/login com credenciais corretas gera sessão válida', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@admin.com', password: 'admin' })
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const setCookie = res.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('admin_token='), 'Cookie admin_token não retornado no header set-cookie');
    
    const match = setCookie.match(/admin_token=([^;]+)/);
    assert(match, 'Token não extraído');
    adminCookie = `admin_token=${match[1]}`;
  });

  // ------------------------------------------------------------------
  // 5. APIS ADMINISTRATIVAS E DASHBOARD
  // ------------------------------------------------------------------
  console.log('\n📌 [5/7] Testando APIs Administrativas com Sessão Válida...');

  await test('Acesso a /api/admin/users com cookie de administrador', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Cookie: adminCookie }
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.users || data), 'Esperado lista de administradores');
  });

  await test('GET /api/metricas (Estatísticas do Painel)', async () => {
    const res = await fetch(`${BASE_URL}/api/metricas`, {
      headers: { Cookie: adminCookie }
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const data = await res.json();
    assert(typeof data.totalTitles === 'number', 'totalTitles ausente ou não numérico');
    assert(typeof data.totalLoans === 'number', 'totalLoans ausente ou não numérico');
    assert(typeof data.activeLoans === 'number', 'activeLoans ausente ou não numérico');
  });

  await test('GET /api/kanban/data (Quadro Kanban da Biblioteca)', async () => {
    const res = await fetch(`${BASE_URL}/api/kanban/data`, {
      headers: { Cookie: adminCookie }
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.reservations), 'reservations ausente');
    assert(Array.isArray(data.activeLoans), 'activeLoans ausente');
    assert(Array.isArray(data.returnedLoans), 'returnedLoans ausente');
  });

  await test('GET /api/alunos (Listagem de Alunos)', async () => {
    const res = await fetch(`${BASE_URL}/api/alunos`, {
      headers: { Cookie: adminCookie }
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.students || data), 'Esperado lista de alunos');
    const students = Array.isArray(data) ? data : data.students;
    if (students.length > 0) {
      testStudentId = students[0].id;
    }
  });

  // ------------------------------------------------------------------
  // 6. FLUXO DO ALUNO (GAMIFICAÇÃO E DASHBOARD)
  // ------------------------------------------------------------------
  console.log('\n📌 [6/7] Testando Fluxo de Alunos e Gamificação...');

  await test('Bloqueio de /api/aluno/dashboard sem sessão (401)', async () => {
    const res = await fetch(`${BASE_URL}/api/aluno/dashboard`);
    assert(res.status === 401, `Esperado 401, recebido ${res.status}`);
  });

  const timestamp = Date.now();
  const testUsername = `alunoteste_${timestamp}`;
  const testStudentName = `Aluno Automação ${timestamp}`;
  const testClass = '3º Ano TI';

  await test('Cadastro de Perfil de Aluno (/api/aluno/auth/signup)', async () => {
    const res = await fetch(`${BASE_URL}/api/aluno/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testStudentName,
        className: testClass,
        username: testUsername,
        password: 'Password123!'
      })
    });
    assert(res.status === 200 || res.status === 201, `Esperado 200/201, recebido ${res.status}`);
  });

  await test('Login de Aluno (/api/aluno/auth/login) e geração de cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/aluno/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: 'Password123!'
      })
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const setCookie = res.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('student_session='), 'Cookie student_session não retornado');
    const match = setCookie.match(/student_session=([^;]+)/);
    studentCookie = `student_session=${match[1]}`;
  });

  await test('GET /api/aluno/dashboard com sessão de aluno válida', async () => {
    const res = await fetch(`${BASE_URL}/api/aluno/dashboard`, {
      headers: { Cookie: studentCookie }
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const data = await res.json();
    assert(data.profile, 'Dados de profile ausentes');
    assert(data.student, 'Dados de student ausentes');
    assert(Array.isArray(data.quests), 'Missões ausentes');
  });

  // ------------------------------------------------------------------
  // 7. FLUXO OPERACIONAL (RESERVA, EMPRÉSTIMO E DEVOLUÇÃO)
  // ------------------------------------------------------------------
  console.log('\n📌 [7/7] Testando Fluxo de Empréstimos, Reservas e Devolução...');

  // Garante um livro de teste com estoque
  let bookForFlow = await prisma.book.findFirst({
    where: { quantity: { gt: 1 } }
  });
  if (!bookForFlow) {
    bookForFlow = await prisma.book.create({
      data: {
        title: 'Livro de Teste Automatizado',
        author: 'Autor Teste',
        quantity: 5,
        genres: ['Ficção', 'Tecnologia']
      }
    });
  }

  await test('Criar Reserva Pública (/api/reservas) retorna 201 Created', async () => {
    const res = await fetch(`${BASE_URL}/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testStudentName,
        className: testClass,
        bookId: bookForFlow.id
      })
    });
    assert(res.status === 201, `Esperado 201, recebido ${res.status}`);
    const data = await res.json();
    assert(data.reservation?.id, 'Reserva não gerou ID');
    testReservationId = data.reservation.id;
  });

  await test('Transição no Kanban com itemId ausente retorna 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/api/kanban/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({
        fromStatus: 'reserved',
        toStatus: 'active'
      })
    });
    assert(res.status === 400, `Esperado 400, recebido ${res.status}`);
  });

  await test('Transição no Kanban: Reserva -> Empréstimo Ativo (/api/kanban/move)', async () => {
    assert(testReservationId, 'ID da reserva não disponível para transição');
    const res = await fetch(`${BASE_URL}/api/kanban/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({
        itemId: testReservationId,
        fromStatus: 'reserved',
        toStatus: 'active'
      })
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const data = await res.json();
    assert(data.success, 'Falha na movimentação do kanban');
    assert(data.loan?.id, 'Empréstimo não criado a partir da reserva');
    testLoanId = data.loan.id;
  });

  await test('Devolução do Livro (/api/emprestimos/devolucao)', async () => {
    assert(testLoanId, 'ID do empréstimo não disponível para devolução');
    const res = await fetch(`${BASE_URL}/api/emprestimos/devolucao`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({
        loanId: testLoanId
      })
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const data = await res.json();
    assert(data.id && data.status === 'returned', 'Falha ao registrar devolução');
  });

  await test('Tentativa de devolução duplicada rejeitada com 409 Conflict', async () => {
    assert(testLoanId, 'ID do empréstimo não disponível');
    const res = await fetch(`${BASE_URL}/api/emprestimos/devolucao`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({
        loanId: testLoanId
      })
    });
    assert(res.status === 409, `Esperado 409 Conflict, recebido ${res.status}`);
  });

  await test('Logout do Aluno (/api/aluno/auth/logout)', async () => {
    const res = await fetch(`${BASE_URL}/api/aluno/auth/logout`, {
      method: 'POST',
      headers: { Cookie: studentCookie }
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const setCookie = res.headers.get('set-cookie');
    assert(setCookie && (setCookie.includes('student_session=;') || setCookie.includes('Max-Age=0') || setCookie.includes('Expires=')), 'Cookie student_session não foi expirado');
  });

  await test('Logout do Administrador (/api/admin/auth/logout)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/logout`, {
      method: 'POST',
      headers: { Cookie: adminCookie }
    });
    assert(res.status === 200, `Esperado 200, recebido ${res.status}`);
    const setCookie = res.headers.get('set-cookie');
    assert(setCookie && (setCookie.includes('admin_token=;') || setCookie.includes('Max-Age=0') || setCookie.includes('Expires=')), 'Cookie admin_token não foi expirado');
  });

  // Limpeza de dados de teste criados
  try {
    if (testLoanId) {
      await prisma.loan.delete({ where: { id: testLoanId } }).catch(() => {});
    }
    if (testReservationId) {
      await prisma.reservation.delete({ where: { id: testReservationId } }).catch(() => {});
    }
    const studentCreated = await prisma.student.findFirst({ where: { name: testStudentName } });
    if (studentCreated) {
      await prisma.studentProfile.deleteMany({ where: { studentId: studentCreated.id } }).catch(() => {});
      await prisma.student.delete({ where: { id: studentCreated.id } }).catch(() => {});
    }
  } catch (cleanErr) {
    console.warn('Aviso de limpeza:', cleanErr.message);
  }

  console.log('\n======================================================');
  console.log(`📊 RESUMO DOS TESTES:`);
  console.log(`   Total de Testes: ${results.passed + results.failed}`);
  console.log(`   ✅ Sucessos:     ${results.passed}`);
  console.log(`   ❌ Falhas:       ${results.failed}`);
  console.log('======================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests()
  .catch((e) => {
    console.error('Erro crítico no executor de testes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
