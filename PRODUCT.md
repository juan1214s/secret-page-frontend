# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Angular (standalone components, no NgModules), Tailwind CSS, signals-based state (no NgRx). Single Angular app with two route zones: a public directory site and a guarded `/admin` panel. Backend is an existing NestJS + TypeORM + Postgres API (JWT auth with access/refresh rotation, roles `admin`/`user`).

## Users

Primary user for the current work: a small team of moderators/admins operating the internal admin panel. All have `admin` role (the API's `user` role exists but no admin-facing feature currently depends on it). Team is small enough that this is not a large multi-department org — think a handful of people sharing moderation and content-management duties, not solo, not enterprise-scale.

## Product Purpose

A public profile directory (people/services listed by department/city in Colombia) with an internal admin panel to operate it: manage the location taxonomy (departments/cities), manage profiles (with photos, featured/priority ranking), moderate user-submitted comments before they go public, and manage admin/user accounts. Success for the admin panel = moderators can scan, act, and move on quickly — this is an operate/task surface, not a marketing surface.

## Positioning

Internal operations tool for a directory whose public value is fast local browsing plus a WhatsApp-first contact flow. The admin panel's job is to keep that directory accurate and clean (right listings, right ranking, no spam/abuse in comments) with minimal friction for the moderators running it day to day.

## Operating Context

- Desktop-first: moderators work from a desktop/laptop, not primarily on mobile. Responsive behavior should be reasonable but is not the priority.
- Core admin workflows: log in (JWT, 15 min access / 7 day refresh, rotates on use); manage departments and cities (simple CRUD, name-only entities); manage profiles (name, description, WhatsApp number, city, active/featured/priority); manage images per profile (upload with type/size constraints — jpeg/png/webp, 5MB max, one main image, ordering); moderate comments (approve/reject a queue of pending, newest-submitted-first is not guaranteed — pending queue is oldest-first); manage admin/user accounts (no self-service password change yet).
- Multiple moderators may be working concurrently; no in-app indication currently of who edited what (backend doesn't track this), so the UI should not imply per-user audit trails that don't exist.

## Capabilities and Constraints

- Auth: JWT access + refresh with rotation; a stolen/reused refresh token is rejected (401) — UI must handle forced logout gracefully on that path.
- Rate limits from the backend: login 5/min then 15 min block per IP (shared across the team on the same network — a lockout can affect multiple moderators at once); refresh 20/min; general API 120/min per IP.
- Image upload: only jpeg/png/webp accepted, 5MB max, one file per request; validated both client-side (fast feedback) and server-side.
- No password-change endpoint exists yet — do not design that flow.
- Profiles have no "owner" — any admin can edit any profile; there is no per-admin scoping.
- Deleting a profile does not delete its S3 image objects (only DB rows) — not a UI concern, but don't imply "fully deleted" in copy.
- Comments are created unapproved by default from the public site; the admin's moderation queue (`GET /comments/pending`) is the only path to making them visible publicly.

## Brand Commitments

None yet. No confirmed product name or logo — placeholder branding ("Panel Admin" or similar) for this phase; real branding to be supplied later.

## Evidence on Hand

None. No existing UI, screenshots, logo, or brand assets for this project — this is a from-scratch build. Backend API is real and documented (`docs/API.md`, `docs/ARCHITECTURE.md` in the sibling `page-xxx` repo); domain entities and endpoint shapes there are authoritative and must not be reinvented.

## Product Principles

1. Operate mode: scanability and low-friction task completion beat visual flourish. Moderators should be able to tell listing state, comment status, and image status at a glance.
2. Reflect the real access model — don't design features the backend can't support yet (password change, per-admin ownership, audit trails).
3. Small-team reality: no need for heavy role-based UI branching or org-scale navigation; keep the information architecture flat and direct.
4. Desktop-first, reasonably responsive — not a mobile-first design exercise.
5. Light, clean color palette per explicit user request — calm, intuitive, not loud or "SaaS-generic."

## Accessibility & Inclusion

No specific standard mandated by the user. Default to solid baseline practice (contrast, focus states, keyboard operability for forms/tables) since this is a real internal tool used daily, not a throwaway prototype.
