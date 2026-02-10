# Project Constitution – AI-Driven Todo App (Phase II)

## 1. Purpose of This Constitution

This constitution defines the **non‑negotiable rules, principles, and workflow constraints** for building the Phase II Todo Full‑Stack Web Application. It exists to ensure consistency, security, quality, and strict adherence to **AI‑driven, spec‑first development**.

Any implementation, change, or iteration **must comply with this constitution**.

---

## 2. Core Principles (Binding)

### 2.1 Spec‑First Development (MANDATORY)

* No feature may be implemented without an approved specification.
* Specifications live exclusively inside the `/specs` directory.
* Code must always reference specs using `@specs/...`.
* If behavior changes, **specs must be updated first**.

❌ No ad‑hoc coding
❌ No undocumented changes

---j

### 2.3 Single Source of Truth

* Specifications are the authoritative source of behavior.
* Code is considered an **output**, not the authority.
* If code and spec conflict → **spec wins**.

---

## 3. Scope Boundaries (Phase II)

### Included

* Full‑stack Todo web application
* User authentication (Better Auth + JWT)
* Task CRUD functionality
* Neon PostgreSQL persistence
* REST API with FastAPI
* Responsive frontend with Next.js

### Explicitly Excluded

* Chatbot features (Phase III only)
* Role‑based access (admin, teams, etc.)
* File uploads or attachments
* Third‑party integrations beyond defined stack

---

## 4. Technology Constitution (Locked Stack)

| Layer    | Technology                 | Status |
| -------- | -------------------------- | ------ |
| Frontend | Next.js 16+ (App Router)   | Locked |
| Backend  | FastAPI (Python)           | Locked |
| ORM      | SQLModel                   | Locked |
| Database | Neon Serverless PostgreSQL | Locked |
| Auth     | Better Auth (JWT)          | Locked |
| Specs    | Spec‑Kit Plus              | Locked |

❌ No substitutions allowed

---

## 5. Authentication & Security Law

### 5.1 JWT Is Mandatory

* Every API request must include a valid JWT token
* Token must be verified on backend
* Token payload defines user identity

### 5.2 User Isolation

* Users may only access their own tasks
* `user_id` from JWT **must match** route user_id
* Database queries must always be user‑scoped

### 5.3 Failure Rules

* Missing token → `401 Unauthorized`
* Invalid token → `401 Unauthorized`
* Cross‑user access attempt → `403 Forbidden`

---

## 6. API Governance Rules

* All routes live under `/api/`
* RESTful semantics are required
* Responses must be JSON
* Errors must use proper HTTP status codes

| Status | Meaning          |
| ------ | ---------------- |
| 200    | Success          |
| 201    | Created          |
| 400    | Validation error |
| 401    | Unauthorized     |
| 403    | Forbidden        |
| 404    | Not found        |

---

## 7. Database Rules

* SQLModel is the only ORM allowed
* No raw SQL unless explicitly specified
* All tables must be defined in `/specs/database/schema.md`
* Migrations must reflect spec changes

---

## 8. Frontend Rules

* Server Components by default
* Client Components only when required
* API access only via centralized API client
* No direct backend calls inside components

---

## 9. Backend Rules

* FastAPI is the single backend entry point
* JWT verification middleware is mandatory
* Business logic must not live in route files
* Pydantic models for all I/O

---

## 10. Monorepo Discipline

* Frontend and backend live in the same repository
* Shared context is required for Claude Code
* CLAUDE.md files define local rules

---

## 11. Phase Progression Law

| Phase                 | Status      |
| --------------------- | ----------- |
| Phase I – Console App | Completed   |
| Phase II – Web App    | In Progress |
| Phase III – Chatbot   | Locked      |

No Phase III work is allowed until Phase II is complete and reviewed.

---

## 12. Enforcement

If any rule in this constitution is violated:

1. Implementation is invalid
2. Changes must be reverted
3. Specs must be corrected before retry

---

## 13. Final Authority

This constitution overrides:

* Individual preferences
* Implementation shortcuts
* Time pressure decisions

**Specs + Constitution define the project.**