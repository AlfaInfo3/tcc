# Implementation Plan: GSAP Animations, Security Hardening & Neon Migration

## Task Overview
- **Project**: Next.js 16 + React 19 + Prisma + Tailwind CSS v4
- **Goals**:
  1. Cinematic GSAP ScrollTrigger animations & fade-ins on the Home landing page (`src/app/page.tsx`).
  2. Full security audit & immediate remediation (HMAC-SHA256 signed session tokens, eliminate `'fake-jwt-token'`, secure middleware, sanitize API inputs, security headers).
  3. Migration to Neon PostgreSQL (Prisma `directUrl` configuration, connection pooling setup, resilient environment config).

---

## Task Breakdown

### Phase 1: Neon Database Architecture & Prisma Setup
- [ ] Configure `prisma/schema.prisma` with `directUrl = env("DIRECT_URL")` for Neon PgBouncer pooling + migrations.
- [ ] Update `src/lib/prisma.ts` with connection retry and error handling.
- [ ] Create `.env.example` with documented Neon connection strings (`DATABASE_URL` pooled, `DIRECT_URL` direct).
- [ ] Regenerate Prisma client (`npx prisma generate`).

### Phase 2: Security Audit & Immediate Remediation
- [ ] Implement cryptographically secure token signing/verification utility (`src/lib/security.ts` using Node.js `crypto` HMAC-SHA256 with timestamp expiry).
- [ ] Replace vulnerable `src/lib/auth.ts` and `src/lib/auth-api.ts` to verify signed tokens and validate active sessions against database/secret.
- [ ] Harden `/api/auth/login/route.ts` and `/api/aluno/auth/login/route.ts` to issue tamper-proof signed session cookies.
- [ ] Update `src/middleware.ts` to protect `/api/admin/*` and administrative paths against unauthorized access.
- [ ] Configure security headers in `next.config.ts` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security, Permissions-Policy).
- [ ] Remove hardcoded tokens (`fake-jwt-token`) and sensitive test scripts.

### Phase 3: Home Page Cinematic GSAP ScrollTrigger Animations
- [ ] Create dedicated GSAP scroll animation controller (`src/components/home/HomeAnimations.tsx` or integrated into `src/app/page.tsx`) using `gsap.context()` for clean React 19 lifecycle management.
- [ ] Animate Hero section: headline split/fade-in, subtitle soft entrance, CTA button scale-up, background subtle parallax.
- [ ] Animate Biblioteca section: scroll-triggered fade-in-left for text, entrance for student image, floating card bounce/glide effect.
- [ ] Animate Nossos Diferenciais: staggered scroll reveal with icon micro-interactions (`stagger: 0.15s`).
- [ ] Animate Turmas grid: ScrollTrigger batch reveal on cards with smooth hover 3D tilt/elevate effects.
- [ ] Ensure full responsiveness, mobile performance (smooth fallbacks), and `prefers-reduced-motion` compliance.

### Phase 4: Verification & Audit Suite
- [ ] Run `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` to verify zero critical secrets or vulnerable patterns.
- [ ] Run TypeScript compilation and build check.
- [ ] Document changes, security report, and Neon deployment guide.
