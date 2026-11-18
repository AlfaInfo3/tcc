#!/usr/bin/env node
/**
 * Validador de rotas internas.
 *
 * Percorre o App Router em `src/app`, monta a lista de rotas de página e
 * confere se todos os links internos do projeto (`href`, `router.push`,
 * `redirect`, ...) apontam para uma página existente.
 *
 * Uso: npm run validate:routes
 */

import path from 'node:path';
import { readdirSync, readFileSync, statSync } from 'node:fs';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'src', 'app');
const SRC_DIR = path.join(ROOT, 'src');
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const IGNORED_DIRS = new Set(['node_modules', '.next', 'dist', 'build', 'coverage']);

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    const absolute = path.join(directory, entry);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      if (!IGNORED_DIRS.has(entry)) walk(absolute, files);
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry))) files.push(absolute);
  }

  return files;
}

function segmentsFor(directory) {
  return directory
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    // Route groups like (public) do not affect the URL.
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')));
}

function collectRoutes() {
  return walk(APP_DIR)
    .filter((file) => path.basename(file) === 'page.tsx' || path.basename(file) === 'page.ts')
    .map((file) => {
      const directory = path.relative(APP_DIR, path.dirname(file));
      const segments = segmentsFor(directory === '.' ? '' : directory);
      return `/${segments.join('/')}`.replace(/\/+$/, '') || '/';
    });
}

const DYN = '__DYNAMIC__';

function normalizeLink(rawLink) {
  const [withoutQuery] = rawLink.split(/[?#]/);
  let link = withoutQuery.trim();

  if (!link) return null;

  // Template literals: `/admin/users/${id}` → `/admin/users/__DYNAMIC__`
  link = link.replace(/\$\{[^}]*\}/g, DYN);

  return link;
}

function isExternalOrIgnored(link) {
  return (
    !link.startsWith('/') ||
    link.startsWith('//') ||
    link.startsWith('/api/') ||
    link.startsWith('/_next/')
  );
}

function routeMatches(link, route) {
  const linkSegments = link.split('/').filter(Boolean);
  const routeSegments = route.split('/').filter(Boolean);

  if (routeSegments.length !== linkSegments.length) return false;

  return routeSegments.every((segment, index) => {
    if (segment.startsWith('[...') || segment.startsWith('[[...')) return true;
    if (segment.startsWith('[') && segment.endsWith(']')) return true;
    return segment === linkSegments[index];
  });
}

function hasRoute(link, routes) {
  return routes.some((route) => routeMatches(link, route));
}

const LINK_PATTERNS = [
  // JSX href={"/path"} / href={'/path'} / href={`/path`}
  /\bhref\s*=\s*\{\s*[`'"]([^`'"]+)[`'"]\s*\}/g,
  // JSX href="/path"
  /\bhref\s*=\s*[`'"]([^`'"]+)[`'"]/g,
  // router.push('/path') / router.replace(`/path`)
  /\brouter\.(?:push|replace)\(\s*[`'"]([^`'"]+)[`'"]/g,
  // redirect('/path') / permanentRedirect('/path')
  /\b(?:permanentRedirect|redirect)\(\s*[`'"]([^`'"]+)[`'"]/g,
  // window.location.href = '/path'
  /\bwindow\.location(?:\.href)?\s*=\s*[`'"]([^`'"]+)[`'"]/g,
  // href: '/path' inside config objects
  /\bhref:\s*[`'"]([^`'"]+)[`'"]/g,
];

function extractLinks(source) {
  const links = new Set();

  for (const pattern of LINK_PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      links.add(match[1]);
    }
  }

  return links;
}

function main() {
  const routes = collectRoutes();
  const files = walk(SRC_DIR);
  const problems = [];
  let checkedLinks = 0;

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const lines = source.split(/\r?\n/);

    for (const rawLink of extractLinks(source)) {
      const link = normalizeLink(rawLink);
      if (!link || isExternalOrIgnored(link)) continue;

      checkedLinks += 1;

      if (hasRoute(link, routes)) continue;

      const lineIndex = lines.findIndex((line) => line.includes(rawLink));
      const relative = path.relative(ROOT, file).replace(/\\/g, '/');
      problems.push({ file: relative, line: lineIndex + 1, link });
    }
  }

  if (problems.length === 0) {
    console.log(`OK: ${checkedLinks} links internos verificados em ${files.length} arquivos.`);
    return;
  }

  console.error(`Encontrados ${problems.length} links apontando para rotas inexistentes:\n`);

  for (const problem of problems) {
    console.error(`  ${problem.file}:${problem.line}  →  ${problem.link}`);
  }

  process.exitCode = 1;
}

main();
