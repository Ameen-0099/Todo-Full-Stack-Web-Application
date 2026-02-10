# Todo App – Phase II Architecture Specification

## 1. Purpose

This document defines the **system architecture** for Phase II of the AI-Driven Todo App. It describes how the frontend, backend, authentication system, and database interact, and establishes the **trust boundaries and data flow** for the application.

This specification must be completed before database, API, or feature-level specifications.

---

## 2. High-Level Architecture

The system follows a **three-layer architecture**:

1. **Presentation Layer** – Next.js Web Application
2. **Application Layer** – FastAPI REST Backend
3. **Data Layer** – Neon Serverless PostgreSQL

Authentication is handled by **Better Auth** on the frontend and enforced on the backend via **JWT verification**.

---

## 3. Components Overview

### 3.1 Frontend (Next.js)

* Built using Next.js 16+ with App Router
* Uses Server Components by default
* Client Components only for user interaction (forms, buttons)
* Responsible for:

  * Rendering UI
  * Handling user authentication via Better Auth
  * Storing JWT securely in session
  * Sending authenticated API requests

### 3.2 Authentication Layer (Better Auth)

* Runs inside the Next.js frontend
* Handles:

  * User signup
  * User login
  * Session management
* Issues **JWT tokens** upon successful authentication
* JWT is signed using shared secret `BETTER_AUTH_SECRET`

### 3.3 Backend (FastAPI)

* Acts as a stateless REST API
* Does not manage sessions
* Responsibilities:

  * Verify JWT on every request
  * Extract authenticated user identity
  * Enforce user-level authorization
  * Execute business logic
  * Interact with database via SQLModel

### 3.4 Database (Neon PostgreSQL)

* Serverless PostgreSQL instance
* Stores persistent task data
* User data is referenced by user ID provided by Better Auth
* Accessed exclusively through SQLModel ORM

---

## 4. Authentication & Authorization Flow

1. User submits login/signup request via frontend UI
2. Better Auth validates credentials
3. Better Auth issues a signed JWT
4. Frontend includes JWT in all API requests:

   * `Authorization: Bearer <token>`
5. FastAPI middleware:

   * Extracts JWT
   * Verifies signature using shared secret
   * Decodes user ID and metadata
6. Backend compares JWT user ID with request context
7. Requests failing validation are rejected

---

## 5. Request Lifecycle (Example: Fetch Tasks)

1. User navigates to tasks page
2. Frontend retrieves JWT from session
3. Frontend sends GET request to backend API
4. FastAPI verifies JWT
5. FastAPI queries database for tasks owned by user
6. Database returns filtered results
7. Backend returns JSON response
8. Frontend renders task list

---

## 6. Trust Boundaries

| Boundary           | Responsibility                   |
| ------------------ | -------------------------------- |
| Browser → Frontend | UI rendering and auth initiation |
| Frontend → Backend | JWT-secured API calls            |
| Backend → Database | Authorized data access           |

No layer bypasses another.

---

## 7. Security Considerations

* All backend endpoints require JWT authentication
* JWT verification occurs before any business logic
* User identity is derived exclusively from JWT
* Task ownership enforced at query level
* Secrets stored via environment variables

---

## 8. Deployment Assumptions

* Frontend and backend may be deployed independently
* Shared JWT secret is configured via environment variables
* Backend is publicly accessible only via secured endpoints

---

## 9. Non-Goals

* No server-side rendering of auth logic
* No direct database access from frontend
* No shared sessions between frontend and backend

---

## 10. Authority

This architecture specification governs:

* Database schema design
* API endpoint behavior
* Feature-level specifications

All subsequent specs must align with this architecture.