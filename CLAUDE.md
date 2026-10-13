# CLAUDE.md — CivicFix

This file gives Claude Code full context on the CivicFix project: what it is, what is built, what changed recently, how the developer wants to work, and what comes next. Read it fully before making changes.

Last updated: 13 Oct 2026

---

## 1. About the developer (read this first)

- Aditya Narayan, B.Tech CSE student (5th semester), building CivicFix as a portfolio project for SWE internship interviews.
- He must be able to **explain every line** in an interview. Code must stay simple, readable and explainable. Avoid clever abstractions, extra libraries or patterns he hasn't seen unless there is a clear reason, and explain that reason.
- **Skill level:**
  - Comfortable: basic JS syntax, `async/await`, Express routes/middleware/`req`/`res`/status codes, basic Git, terminal basics.
  - Conceptually understands (because he built them): REST, JWT auth, bcrypt hashing, DB transactions, RBAC, parameterized queries, 401 vs 403, ownership checks, SQL JOINs, status state machines.
  - Shaky: array methods (`map`/`filter`/`reduce`), destructuring, spread/rest, arrow function nuances, `this`.
  - **Zero** React/frontend experience: no JSX, hooks, props, React Router, Context, forms, CSS frameworks or map libraries yet.
- **Learning approach (decided):** NO separate exercises or practice projects. He learns React only by building the CivicFix frontend. When a new concept appears (e.g. `useState`, `map` for lists, `useEffect`), explain it right there in context, briefly.

### How to work with him
- Explain simply, **one step at a time**. Explain **why**, not just what.
- Short, conversational, friendly "bro" tone.
- **No huge code dumps.** Give small pieces and say exactly **which file and where** to put them (e.g. "below line X", "inside the `try` block, at the top").
- Give **exact steps to run and test** (terminal commands, Postman steps, what to click in the browser, the expected result). For Postman, one test per message, with the expected status code and body.
- If he makes a mistake, **explain the mistake**; don't silently replace his code.
- **Flag weak, outdated or non-production choices** honestly instead of agreeing blindly.
- When a test returns a red status code that was the *expected* result (400/403/404/409), say clearly that it is a pass. Postman's built-in AI suggests "fixes" for these; tell him to decline them.

### Working agreement (decided 13 Oct 2026, applies to frontend AND backend)
1. Claude explains the concept, gives the code, and says exactly which file/folder and where it goes.
2. Aditya types/applies it himself, runs it, and shares his ideas or anything that looks off.
3. Claude says exactly how and where to change things. **Claude never edits project code directly** (reading files to review is fine).
4. After each session, Claude reviews his code and suggests improvements (formatting, naming, structure).
- Suggest typing (not pasting) when a concept is new; pasting is fine for config files.
- Styling: **Tailwind CSS**. Explain each new class the first time it appears.
- HTTP: **fetch** (no Axios), with one small helper that adds the token.

### Terminal and Git (Windows)
- His VS Code terminal is **Windows PowerShell 5.1**: `&&` does **not** work. Give commands on **separate lines**, one per code block.
- He usually has two terminals: **terminal 1 runs the server** from `backend/`, **terminal 2 is for git**. Check which folder he is in before giving paths: from `backend/` it is `git add index.js`, from the repo root it is `git add backend/index.js`. Prefer explicit paths over `git add .` (the untracked `frontend/` folder would get swept in).
- After a meaningful change, end with a ready-to-use commit, e.g.:
  ```
  git add backend/index.js
  git commit -m "..."
  git push
  ```
- **Restart reminder:** stale servers caused confusing test results several times. **nodemon is installed**: tell him to run `npm run dev` in `backend/` so the server restarts on save. If he uses `node index.js`, remind him to restart (`Ctrl + C`, then `node index.js`) after every backend change.
- Copying URLs from chat into Postman sometimes brings a trailing newline (shows as `↵`, server error mentions `%0A`). Tell him to delete it.

---

## 2. Project overview

**CivicFix** is a civic issue reporting and tracking platform.

- **Citizens** report infrastructure problems (road damage, faulty street lighting, waste, water leakage) with a description, GPS coordinates and a photo, then track the status and full history.
- **Employees** (municipal staff) work on issues assigned to them: move them to IN_PROGRESS and RESOLVED with comments, and upload an "after" photo.
- **Admins** verify reported issues, assign them to employees, and can view the user list.

Issue lifecycle: `REPORTED → VERIFIED → ASSIGNED → IN_PROGRESS → RESOLVED` (enforced by the backend, see section 6).

GitHub: https://github.com/adityanarayan404/Civic-Fix (public, branch `main`)

---

## 3. Tech stack

| Layer | Choice | Status |
|---|---|---|
| Backend | Node.js + Express 5 | Complete |
| Database | MySQL 8 (local, MySQL Workbench), database `civicfix` | Complete |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` | Complete |
| Images | Cloudinary + Multer (`multer-storage-cloudinary`) | Complete |
| Dev tooling | nodemon (`npm run dev`) | Installed |
| Frontend | React with **Vite** (plain React, **not** Next.js: no SSR/SEO needed) | Starting now |
| Styling | **Tailwind CSS** | Planned |
| Routing | React Router | Planned |
| Auth state | Context API (not Redux; app is small) | Planned |
| HTTP | **fetch** (built-in) | Planned |
| Maps | Mapbox or Google Maps (undecided) | Planned |
| Deploy | Vercel (frontend) + cloud host and cloud MySQL (backend) | Not started |

Do **not** use `create-react-app` (deprecated). Node version on his machine: v24.

---

## 4. Folder structure

```
civic fix/                     ← repo root (Git initialized here)
  README.md                    ← recruiter-facing README (pushed)
  CLAUDE.md                    ← this file
  backend/
    config/
      db.js                    ← mysql2 connection pool (also loads dotenv)
      cloudinary.js            ← Cloudinary config + multer storage (jpg/jpeg/png, folder "civicfix")
    middleware/
      auth.js                  ← verifyToken, requireRole
    index.js                   ← Express app; ALL routes live here (not split into modules yet)
    .env                       ← secrets (gitignored)
    .gitignore                 ← node_modules, .env
    package.json / package-lock.json   ← scripts: "start" (node), "dev" (nodemon)
  frontend/                    ← Vite React starter template (untouched demo code). Committed and pushed by
                                 accident inside commit 73ed488 (the assigned_to fix); harmless, left as is.
                                 Has its own .gitignore (node_modules excluded).
```

Local path on his Windows machine: `C:\Users\adity\Desktop\civic fix\` (the space in the name means paths need quotes in the terminal).

Ports: backend `http://localhost:5000`, Vite dev server `http://localhost:5173`.

---

## 5. Database schema (`civicfix`)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,          -- bcrypt hash
  role VARCHAR(20) DEFAULT 'CITIZEN'       -- CITIZEN / EMPLOYEE / ADMIN
);

CREATE TABLE issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                    -- reporter
  type VARCHAR(50) NOT NULL,               -- POTHOLE / STREET_LIGHT / GARBAGE / WATER_LEAKAGE ...
  description TEXT,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  image_url TEXT,                          -- citizen's "before" photo
  resolved_image_url TEXT,                 -- staff "after" photo (added 13 Oct 2026)
  priority VARCHAR(20) DEFAULT 'MEDIUM',   -- LOW / MEDIUM / HIGH / CRITICAL (no route sets it yet)
  status VARCHAR(30) DEFAULT 'REPORTED',
  assigned_to INT NULL,                    -- current assignee (added 13 Oct 2026)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE issue_updates (               -- audit trail (status changes AND assignments)
  id INT AUTO_INCREMENT PRIMARY KEY,
  issue_id INT NOT NULL,
  updated_by INT NOT NULL,
  status VARCHAR(30) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE assignments (                 -- history of every assignment
  id INT AUTO_INCREMENT PRIMARY KEY,
  issue_id INT NOT NULL,
  employee_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(id),
  FOREIGN KEY (employee_id) REFERENCES users(id)
);
```

Design decisions (interview points):
- `VARCHAR` instead of `ENUM` for status/priority/role, so new values don't need an `ALTER TABLE`. Validation happens in the app.
- **Current state + history pattern, used twice:**
  - `issues.status` = current state, `issue_updates` = full history.
  - `issues.assigned_to` = current assignee, `assignments` = full history.
  - Both pairs are kept in sync with **transactions**.
- Separate `image_url` / `resolved_image_url` so a staff upload never overwrites the citizen's evidence photo.
- `DECIMAL(10,7)` for coordinates to avoid float rounding.

---

## 6. Backend API (current)

Base URL: `http://localhost:5000`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Route | Access | Notes |
|---|---|---|---|
| GET | `/` | Public | Health check |
| POST | `/api/auth/register` | Public | Body: `name, email, password`. **Role is always `CITIZEN`** (role in body is ignored) |
| POST | `/api/auth/login` | Public | Returns `{ message, token, user: { id, name, email, role } }`. JWT payload `{ id, role }`, expires `1d` |
| GET | `/api/users` | `verifyToken` + `requireRole('ADMIN')` | id, name, email, role (no password) |
| POST | `/api/issues` | `verifyToken` | Body: `type, description, latitude, longitude`. `user_id` comes from `req.user.id`, never the body |
| GET | `/api/issues` | Public | All issues, JOIN users for `reported_by`, newest first |
| GET | `/api/issues/mine` | `verifyToken` | Citizen's own issues (`WHERE user_id = req.user.id`), newest first. Returns `[]` if none |
| GET | `/api/issues/assigned` | `verifyToken` + `requireRole('EMPLOYEE')` | Employee's current tasks (`WHERE assigned_to = req.user.id`). Admins get 403 |
| GET | `/api/issues/:id` | Public | 404 if not found |
| GET | `/api/issues/:id/history` | Public | Timeline from `issue_updates`, JOIN users for updater name, oldest first |
| PATCH | `/api/issues/:id/status` | `verifyToken` + `requireRole('EMPLOYEE','ADMIN')` + rules below | Updates `issues.status` + inserts `issue_updates` in one **transaction**; `updated_by = req.user.id` |
| POST | `/api/issues/:id/assign` | `verifyToken` + `requireRole('ADMIN')` + rules below | One **transaction**: insert `assignments`, set `status = 'ASSIGNED'` and `assigned_to`, insert `issue_updates` (comment `"Assigned to <name>"`) |
| POST | `/api/issues/:id/image` | `verifyToken` + `requireIssueOwnerOrStaff` + `upload.single('image')` | multipart/form-data, field `image`. Citizen → `image_url`; EMPLOYEE/ADMIN → `resolved_image_url`. The response key is `image_url` in both cases |

**Route order matters:** `/api/issues/mine` and `/api/issues/assigned` are defined **above** `/api/issues/:id`, otherwise Express matches `mine` as an `:id`.

### Status rules (`PATCH /status`)
A `nextStatus` lookup table above the route defines the only allowed next step:
```js
const nextStatus = { REPORTED: 'VERIFIED', ASSIGNED: 'IN_PROGRESS', IN_PROGRESS: 'RESOLVED' };
```
Checks, in order, before the transaction:
1. Issue exists → else **404**.
2. `nextStatus[currentStatus] === status` → else **400** `Cannot change status from X to Y` (also rejects invalid or missing status values).
3. VERIFIED can only be set by ADMIN → else **403** `Only admins can verify issues`.
4. An EMPLOYEE can only update issues where `assigned_to === req.user.id` → else **403** `You can only update issues assigned to you`. Admins can update any issue.

VERIFIED → ASSIGNED only happens through `/assign`, never through `PATCH /status`.

### Assignment rules (`POST /assign`)
Checks, in order, before the transaction:
1. Issue exists → else **404**.
2. `employee_id` belongs to a user with role EMPLOYEE → else **400**.
3. Issue is not REPORTED → else **400** `Issue must be verified before it can be assigned`.
4. Issue is not RESOLVED → else **400** `Resolved issues cannot be reassigned`.
5. Not already assigned to that same employee → else **409** `Issue is already assigned to this employee` (uses `Number(employee_id)` because of `===`).

Reassigning an IN_PROGRESS issue to a different employee is allowed and sets the status back to ASSIGNED.

### Middleware

`backend/middleware/auth.js`:
- `verifyToken`: reads `Authorization: Bearer <token>`, verifies it with `JWT_SECRET`, sets `req.user = { id, role }`. Returns 401 `"No token provided"` or `"Invalid or expired token"`.
- `requireRole(...roles)`: returns 403 `"You do not have permission to do this"` if `req.user.role` is not allowed.

`requireIssueOwnerOrStaff` (defined in `index.js`, above the image route):
- Looks up `issues.user_id` for `req.params.id`. Returns 404 if the issue doesn't exist.
- Allows the request if the user owns the issue, or is EMPLOYEE/ADMIN. Otherwise returns 403 `"You can only add images to your own issues"`.
- It runs **before** `upload.single`, so rejected requests never upload to Cloudinary.

### `.env` keys (backend)
`DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET`

---

## 7. Security and correctness work done (all tested in Postman)

1. **Issue creation:** auth required; `user_id` taken from the token. Tested by sending `user_id: 999` in the body; the saved row had the real id (8).
2. **Register privilege escalation:** `role` removed from the body, `'CITIZEN'` hardcoded. Tested with `"role": "ADMIN"`; the login response showed CITIZEN.
3. **Image upload:** auth + ownership/staff check before upload. Tested: no token 401, non-owner citizen 403, owner 200.
4. **User list:** admin only. Tested: no token 401, citizen 403, admin 200.
5. **Photo overwrite (13 Oct):** staff uploads go to `resolved_image_url`. Tested: test2 then admin3 uploaded to issue 4; both URLs kept.
6. **My Issues / My Tasks (13 Oct):** `/mine` (tested 200 with own issues, `[]` for a user with none, 401 without a token) and `/assigned` (tested 200 for employee3, 403 for admin and citizen).
7. **Duplicate assignments (13 Oct):** found while testing (issue 4 was assigned to employee3 twice). Fixed with `assigned_to` + validation. Tested: same assignment again 409, non-existent issue 404, list shows the issue once.
8. **Status lifecycle (13 Oct):** tested on issues 4 and 5: repeat step 400, assign before verify 400, employee verify 403, admin verify 200, assign 201, employee IN_PROGRESS → RESOLVED 200.
9. **Audit trail for assignments (13 Oct):** assignments now appear in `/history` ("Assigned to Employee Three"). Tested on issue 5.

Pre-existing protections: bcrypt (10 rounds), parameterized queries everywhere, the same login error for unknown email and wrong password (prevents enumeration), the password never selected in user queries, and correct 401 vs 403 usage.

Known JWT trade-off: the role is embedded in the token, so a role change only takes effect after the user logs in again.

---

## 8. Test data (local DB)

| Email | Password | Role | Notes |
|---|---|---|---|
| test2@gmail.com | test123 | CITIZEN | user id 8; reported issues 4 and 5 |
| hacker@gmail.com | test123 | CITIZEN | used for negative tests |
| admin3@gmail.com | test123 | ADMIN | user id 10; promoted via SQL |
| employee3@gmail.com | test123 | EMPLOYEE | user id 11; promoted via SQL |
| testuser@gmail.com | unknown | CITIZEN | password forgotten |
| employee2@gmail.com / admin2@gmail.com | unknown | EMPLOYEE / ADMIN | older test accounts |

Issues:
- **Issue 4** (POTHOLE): RESOLVED, `assigned_to` 11, has both photos. Its history has 3 IN_PROGRESS rows (2 extra rows from testing on a stale server) and no ASSIGNED row (it was assigned before that was logged). It also has 2 rows in `assignments`. Harmless test data.
- **Issue 5** (STREET_LIGHT): ASSIGNED to employee 11, with clean VERIFIED + ASSIGNED history. Good for testing the employee flow (IN_PROGRESS → RESOLVED).

The original 4 seed users (inserted manually with plaintext passwords) **cannot log in**.

To create staff: register normally, then run `UPDATE users SET role = 'EMPLOYEE' WHERE email = '...';` and log in again.

Tokens last 1 day; he keeps them in a Notepad file labelled by user.

Test uploads have created extra images in Cloudinary (`civicfix/` folder). They are harmless and can be cleaned later.

---

## 9. Other completed work

- **README.md** at the repo root: professional, recruiter-facing, one emoji per section heading only. It has the Problem/Solution, features, tech stack, and Mermaid diagrams (architecture, lifecycle, ER), plus security and roadmap sections. It deliberately has **no code, API tables or setup steps** (his choice). The tagline says "full-stack" while the frontend is in progress; the status note clarifies this.
- The README was uploaded through the GitHub website and then pulled locally.

---

## 10. Current status / where we are

**Phase: backend gaps closed (13 Oct 2026); frontend about to start.**

Frontend planning (agreed): **one React app** with role-based navbar/pages, not separate apps per role.

| Role | Pages |
|---|---|
| Guest | Home, Login, Register, Issues list, Issue detail (public, for transparency) |
| Citizen | Report Issue (mobile-first), My Issues (`/mine`), Issue detail |
| Employee | My Tasks (`/assigned`), Issue detail + update panel (status, comment, after photo) |
| Admin | Dashboard (all issues, filters, counts), Issue detail + admin panel (verify, assign, later priority), Users, later Map |

The **Issue detail page is shared by all roles**, with extra panels depending on the role.

### Frontend plan (agreed 13 Oct 2026): phases, one working screen at a time
Every phase ends with something clickable in the browser and a commit. **Next session starts at Phase 0.**

| # | Phase | What gets built | React concepts introduced |
|---|---|---|---|
| 0 | **Setup** | Check `npm run dev` in `frontend/` works (→ `http://localhost:5173`); install and configure Tailwind; clean the Vite demo code; **backend CORS** (see below); commit | Project structure: `index.html` → `main.jsx` → `App.jsx` |
| 1 | **Skeleton** | Navbar + placeholder pages wired with React Router | Components, JSX, props, routing |
| 2 | **Auth** | Login/Register forms, AuthContext, token in localStorage (explain the trade-off), role-based navbar, fetch helper that adds the `Authorization` header | `useState`, forms/events, Context, localStorage |
| 3 | **Reading data** | Issues list, Issue detail (both photos + timeline; show "Reported" from `created_at`, since creation doesn't write to `issue_updates`) | `useEffect` + fetch, `.map()` lists, loading/error states, URL params |
| 4 | **Citizen** | Report Issue (type dropdown, description, GPS via `navigator.geolocation`, photo): `POST /api/issues`, then `POST /api/issues/:id/image` with FormData. My Issues (`/mine`) | Controlled forms, geolocation, FormData |
| 5 | **Employee** | My Tasks (`/assigned`), update panel on Issue detail (only offer the allowed next status) | Role-based conditional rendering |
| 6 | **Admin** | Dashboard (filters, counts), verify + assign panel (employee dropdown from `GET /api/users` filtered to EMPLOYEE). **Add the priority route here** (Gap #3, deferred on purpose): `PATCH /api/issues/:id/priority`, admin only, validate LOW/MEDIUM/HIGH/CRITICAL | `.filter()`, API-driven dropdowns |
| 7 | **Polish** | Design pass, map view (Mapbox or Google Maps, undecided), deployment | — |

**Backend CORS (Phase 0):** `cors` is **not** installed yet. Run `npm install cors` in `backend/` and add `app.use(cors({ origin: 'http://localhost:5173' }))` near the top of `index.js`. Otherwise the browser blocks frontend requests to port 5000.

**Design:** show 2–3 reference directions **after Phase 1** (once he knows what a component is).

### UI/design approach (agreed)
- Show 2–3 reference directions instead of designing from a blank slate. He decides color (civic blue/green), layout (cards vs tables) and tone.
- **Mobile-first** for citizen screens (people report from phones).
- Build screen by screen, render it, iterate on real feedback.

---

## 11. Backlog / tech debt (flag when relevant, don't force now)

- Priority route (see step 8 above).
- Add `backend/.env.example` with dummy values.
- Admin endpoint to change user roles (instead of manual SQL).
- Input validation layer for `POST /api/issues` (allowed `type` values, lat/lng ranges, required fields).
- Issue creation doesn't insert a REPORTED row into `issue_updates`; the timeline starts at VERIFIED.
- `require('dotenv').config()` only runs in `config/db.js` and `config/cloudinary.js`; `JWT_SECRET` works because `db.js` is required first. Move it to the top of `index.js` to make this explicit.
- `const bcrypt = require('bcrypt')` sits in the middle of `index.js`; move it to the top with the other requires.
- README line 1 has a stray `[README.md](https://github.com/user-attachments/...)` link left over from the GitHub upload. Delete it.
- README roadmap/features could mention the new lifecycle rules and My Issues/My Tasks.
- Split `index.js` into route/controller modules.
- Automated tests.
- `CivicFix_Project_Context.md` (his older handoff doc) is outdated. This CLAUDE.md supersedes it.
- GitHub "About" description/topics: suggested; may not be filled in yet.

---

## 12. Interview talking points earned so far

- Never trust the client for identity: ids and roles come from the verified JWT.
- Authentication (401) vs authorization (403), both tested; plus 400 (bad input), 404 (missing), 409 (conflicts with current state).
- Ownership checks on top of role checks (image upload; employees can only update their assigned issues).
- Middleware ordering: checks run before side effects (Cloudinary upload, DB writes).
- Transactions keep `issues` consistent with `issue_updates` and `assignments`.
- The current-state + history pattern, applied to both status and assignments.
- The issue lifecycle as a state machine, enforced with a lookup table.
- Found real bugs by planning screens and testing: photo overwrite, duplicate assignments, assignments missing from the audit trail.
- Express route order: specific routes (`/mine`) above parameterized ones (`/:id`).
- VARCHAR vs ENUM reasoning; current state vs audit trail.
- JWT stateless trade-off (role changes need a re-login).
- Prevented privilege escalation on registration.
