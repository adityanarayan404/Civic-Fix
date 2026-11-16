# CivicFix — Project Context (Handoff for Claude)

> **Note (16 Nov 2026):** this snapshot is from 8 Nov. Since then, frontend Phases 2–5 were completed (auth with role tabs, portal landing, issue browsing with filters + near-me sort, reporting with GPS/photo, employee workflow, dark mode). CLAUDE.md is the up-to-date source of truth.

You are helping Aditya Narayan, a 3rd-year B.Tech CSE student, build **CivicFix**: a civic issue reporting and tracking platform. It is a portfolio project for SWE internship interviews, so code must stay **simple and explainable** — he must be able to explain every line in an interview.

GitHub: https://github.com/adityanarayan404/Civic-Fix (branch `main`)
Local path: `C:\Users\adity\Desktop\civic fix\` (space in name → quote paths)

## What the app does

- **Citizens** report infrastructure problems (potholes, street lights, garbage, water leakage) with description, GPS coordinates and a photo, then track status + history.
- **Employees** (municipal staff) work on issues assigned to them: IN_PROGRESS → RESOLVED with comments and an "after" photo.
- **Admins** verify issues, assign them to employees, and view the user list.
- Issue lifecycle (enforced by backend): `REPORTED → VERIFIED → ASSIGNED → IN_PROGRESS → RESOLVED`

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Node.js + Express 5, all routes in `backend/index.js` (not yet split into modules) |
| Database | MySQL 8 local (database `civicfix`), `mysql2` pool in `backend/config/db.js` |
| Auth | JWT (`jsonwebtoken`, payload `{ id, role }`, expires 1d) + bcrypt (10 rounds) |
| Images | Cloudinary + Multer (`multer-storage-cloudinary`), config in `backend/config/cloudinary.js` |
| Frontend | React 19 + Vite 8 (NOT Next.js, NOT create-react-app) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` plugin |
| Routing | React Router v8 — package `react-router` (import from `'react-router'`, NOT `react-router-dom`) |
| HTTP | fetch (no Axios) — planned helper that adds the Authorization header |
| Auth state | Context API + localStorage (planned, Phase 2) |

Ports: backend `http://localhost:5000`, frontend dev `http://localhost:5173`. CORS is enabled for the Vite origin.

## Database schema (summary)

- `users(id, name, email UNIQUE, password bcrypt-hash, role VARCHAR default 'CITIZEN')` — roles: CITIZEN / EMPLOYEE / ADMIN
- `issues(id, user_id FK, type, description, latitude DECIMAL(10,7), longitude DECIMAL(10,7), image_url, resolved_image_url, priority default 'MEDIUM', status default 'REPORTED', assigned_to FK NULL, created_at)`
- `issue_updates(id, issue_id FK, updated_by FK, status, comment, created_at)` — audit trail for status changes AND assignments
- `assignments(id, issue_id FK, employee_id FK, assigned_at)` — history of every assignment

Design decisions: VARCHAR over ENUM (new values without ALTER TABLE; validation in app). Current-state + history pattern used twice (status/issue_updates, assigned_to/assignments), kept in sync with **transactions**. Separate `image_url` (citizen "before") vs `resolved_image_url` (staff "after") so uploads never overwrite evidence.

## Backend API (complete and tested in Postman)

Base URL `http://localhost:5000`; protected routes need `Authorization: Bearer <token>`.

| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Role always hardcoded `CITIZEN` (body role ignored — prevents privilege escalation) |
| POST | `/api/auth/login` | Public | Returns `{ message, token, user: { id, name, email, role } }` |
| GET | `/api/users` | ADMIN | No password field returned |
| POST | `/api/issues` | Any logged-in | `user_id` from token, never the body |
| GET | `/api/issues` | Public | JOIN users for `reported_by`, newest first |
| GET | `/api/issues/mine` | Logged-in | Own issues (defined ABOVE `/:id` — route order matters) |
| GET | `/api/issues/assigned` | EMPLOYEE | Current tasks; admins get 403 |
| GET | `/api/issues/:id` | Public | 404 if missing |
| GET | `/api/issues/:id/history` | Public | Timeline from `issue_updates`, oldest first |
| PATCH | `/api/issues/:id/status` | EMPLOYEE/ADMIN | Lookup table `{REPORTED:'VERIFIED', ASSIGNED:'IN_PROGRESS', IN_PROGRESS:'RESOLVED'}`; only ADMIN can verify; employees only their assigned issues; transaction updates `issues` + inserts `issue_updates` |
| PATCH | `/api/issues/:id/priority` | ADMIN | Validates LOW/MEDIUM/HIGH/CRITICAL, 400 otherwise (added Nov 2026, not yet committed/Postman-tested) |
| POST | `/api/issues/:id/assign` | ADMIN | Transaction: insert `assignments`, set status ASSIGNED + `assigned_to`, insert `issue_updates` ("Assigned to <name>"). Rules: employee must have EMPLOYEE role (400), issue not REPORTED (400), not RESOLVED (400), not already assigned to same employee (409). Reassigning IN_PROGRESS to a different employee is allowed |
| POST | `/api/issues/:id/image` | Owner or staff | `requireIssueOwnerOrStaff` runs BEFORE the Cloudinary upload middleware; citizen → `image_url`, staff → `resolved_image_url` |

Middleware (`backend/middleware/auth.js`): `verifyToken` (401s) and `requireRole(...roles)` (403). `.env` keys: `DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, CLOUDINARY_*`.

## Security work done (all Postman-tested)

- `user_id` and role always from verified JWT, never request body
- Register privilege escalation blocked (role hardcoded CITIZEN)
- Same login error for unknown email and wrong password (prevents enumeration)
- Password never selected in user list queries; bcrypt 10 rounds; parameterized queries everywhere
- Ownership checks on top of role checks (image upload; employees limited to assigned issues)
- Checks run before side effects (ownership check before Cloudinary upload)
- Correct 401 vs 403 vs 400 vs 404 vs 409 usage
- Known trade-off: role is in the JWT, so role changes need a re-login

## Frontend status

Phases 0–1 done and pushed:
- Tailwind set up, Vite demo removed, backend CORS enabled
- React Router skeleton: `Navbar.jsx` (blue bar, not role-based yet) + placeholder pages `Home, Issues, Login, Register, NotFound` under `src/pages/`
- `main.jsx` wraps `<App />` in `<BrowserRouter>`; `App.jsx` has `<Routes>` for `/`, `/issues`, `/login`, `/register`, `*`

Remaining phases (agreed plan — one working screen at a time, commit each phase):
2. **Auth** — Login/Register forms, AuthContext, token in localStorage, role-based navbar, fetch helper (`useState`, forms, Context) ← NEXT
3. **Reading data** — Issues list + Issue detail with photos and timeline (`useEffect`, `.map()`, loading/error states)
4. **Citizen** — Report Issue form with GPS (`navigator.geolocation`) + photo (FormData), My Issues
5. **Employee** — My Tasks, update panel (only offer the allowed next status)
6. **Admin** — Dashboard with filters/counts, verify + assign panel (employee dropdown from `GET /api/users`)
7. **Polish** — design pass, map view (Mapbox or Google Maps, undecided), deployment (Vercel + cloud MySQL)

One React app for all roles (role-based navbar/pages, shared Issue detail page with role-specific panels). Mobile-first for citizen screens.

## How to work with Aditya (important)

- **Zero prior React experience** — explain each new concept (useState, useEffect, props, .map, destructuring, spread) briefly, in context, the first time it appears. No separate exercises; he learns by building CivicFix only.
- Comfortable with: Express, JWT, bcrypt, transactions, RBAC, SQL JOINs, basic JS, async/await, Git basics.
- Shaky on: array methods, destructuring, spread/rest, arrow function nuances, `this`.
- **Working agreement:** explain concept → give small code piece → say exactly which file and where it goes → he types and runs it himself. Don't edit his code directly; if he's stuck and says "fix it", fix and explain the change.
- No huge code dumps. One step at a time, friendly tone, explain WHY.
- Explain each new Tailwind class the first time it appears.
- **Terminal is Windows PowerShell 5.1 — `&&` does NOT work.** Give commands on separate lines. Three terminals: backend (`npm run dev` in `backend/`), frontend (`npm run dev` in `frontend/`), git at repo root.
- nodemon is installed (`npm run dev` restarts backend on save); stale servers caused confusing tests before.
- When a test intentionally expects 400/403/404/409, say clearly it is a PASS.
- Component files PascalCase matching the component; folders lowercase. Windows ignores import casing but Vercel (Linux) doesn't.
- End meaningful changes with a ready-to-use git commit (explicit paths like `git add backend/index.js`, not `git add .`).

## Test data (local DB)

| Email | Password | Role |
|---|---|---|
| test2@gmail.com | test123 | CITIZEN (id 8, reported issues 4 and 5) |
| hacker@gmail.com | test123 | CITIZEN (negative tests) |
| admin3@gmail.com | test123 | ADMIN (id 10) |
| employee3@gmail.com | test123 | EMPLOYEE (id 11) |

Issue 4: RESOLVED with both photos (has some messy duplicate history rows — harmless test data). Issue 5: ASSIGNED to employee 11, clean history. To create staff: register normally, then `UPDATE users SET role='EMPLOYEE' WHERE email='...';` and re-login.

## Immediate next steps

1. Commit the new `/priority` route and test it in Postman (ADMIN token, body `{"priority":"HIGH"}` → 200; bad value → 400; citizen → 403; missing issue → 404).
2. Phase 2 (Auth): design direction first — Aditya will share reference screenshots he likes; propose 2–3 directions; then build Login/Register forms.
3. Later: 1-page "tech decisions" doc for interview prep (deferred until the build is done).

## Backlog / tech debt (flag when relevant, don't force)

- `backend/.env.example` with dummy values
- Admin endpoint to change user roles (currently manual SQL)
- Input validation for `POST /api/issues` (allowed types, lat/lng ranges)
- Issue creation doesn't insert a REPORTED row into `issue_updates` (timeline starts at VERIFIED)
- Move `require('dotenv').config()` to top of `index.js`; move `bcrypt` require to the top
- Split `index.js` into route/controller modules; automated tests
