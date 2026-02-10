# Todo App – Phase II Database Schema Specification

## 1. Purpose

This document defines the **database schema** for Phase II of the AI-Driven Todo App. It specifies tables, fields, relationships, constraints, and indexing rules required to support authenticated, multi-user task management.

This specification must align with:

* `/specs/overview.md`
* `/specs/architecture.md`

No API or feature behavior may contradict this schema.

---

## 2. Database Technology

* **Database:** Neon Serverless PostgreSQL
* **ORM:** SQLModel (mandatory)
* **Connection:** Environment variable `DATABASE_URL`

Raw SQL is not permitted unless explicitly approved in future specs.

---

## 3. Entity Overview

The database consists of two logical entities:

1. **Users** – Managed externally by Better Auth
2. **Tasks** – Managed by this application

The application database **does not manage user authentication data**, but references authenticated users by their unique user ID.

---

## 4. Tables

### 4.1 users (External / Reference Table)

> This table is logically defined for reference only. Creation and lifecycle are managed by Better Auth.

| Field      | Type      | Constraints      |
| ---------- | --------- | ---------------- |
| id         | VARCHAR   | Primary Key      |
| email      | VARCHAR   | Unique, Not Null |
| name       | VARCHAR   | Nullable         |
| created_at | TIMESTAMP | Not Null         |

The application **must not write to this table**.

---

### 4.2 tasks

This table stores all todo tasks created by users.

| Field       | Type         | Constraints                 |
| ----------- | ------------ | --------------------------- |
| id          | INTEGER      | Primary Key, Auto Increment |
| user_id     | VARCHAR      | Not Null, Indexed           |
| title       | VARCHAR(200) | Not Null                    |
| description | TEXT         | Nullable                    |
| completed   | BOOLEAN      | Default: false              |
| created_at  | TIMESTAMP    | Not Null                    |
| updated_at  | TIMESTAMP    | Not Null                    |

---

## 5. Relationships

* Each **task belongs to exactly one user**
* `tasks.user_id` references `users.id`
* No cascading deletes are applied
* Orphan tasks are not permitted

---

## 6. Indexes

The following indexes are required:

| Table | Field      | Purpose                   |
| ----- | ---------- | ------------------------- |
| tasks | user_id    | Fast user-based filtering |
| tasks | completed  | Status filtering          |
| tasks | created_at | Sorting by creation date  |

---

## 7. Constraints & Rules

* `title` must be between 1 and 200 characters
* `description` must not exceed 1000 characters
* `user_id` must always be present
* Tasks without an authenticated owner are invalid

---

## 8. Ownership Enforcement

* All queries must include `user_id` filtering
* No task may be accessed without matching authenticated user
* Ownership is enforced at:

  * API layer
  * ORM query layer

---

## 9. Timestamps

* `created_at` is set on task creation
* `updated_at` is updated on every modification
* Timestamp generation occurs in backend logic

---

## 10. Migration Rules

* Schema changes require spec updates first
* Database migrations must reflect this spec exactly
* No silent or implicit schema changes are allowed

---

## 11. Non-Goals

* No soft deletes
* No task versioning
* No audit logs

---

## 12. Authority

This schema specification governs:

* ORM models
* Database migrations
* API data structures

If a conflict arises, this document takes precedence over feature-level specs.