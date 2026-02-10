# Feature Specification: Task CRUD

## 1. Purpose

This document defines the **Task CRUD feature** for Phase II (Web App) of the AI-Driven Todo Application. It specifies all requirements for creating, reading, updating, deleting, and completing tasks for authenticated users.

All operations must comply with:

* `/specs/overview.md`
* `/specs/architecture.md`
* `/specs/database/schema.md`
* `/specs/features/authentication.md`

---

## 2. Scope

Includes:

* Task creation
* Task retrieval (single & list)
* Task updating
* Task deletion
* Task completion toggle

Excludes:

* Task sharing between users
* Task reminders, notifications, or deadlines
* AI-based suggestions (Phase III)

---

## 3. Actors

* **Authenticated User**: Can perform all task operations
* **Backend Service (FastAPI)**: Processes requests and enforces ownership
* **Database (Neon PostgreSQL)**: Stores task data

---

## 4. Preconditions

* User must be authenticated with valid JWT
* Database connection must be available
* Task input must meet validation rules (title length, optional description)

---

## 5. Create Task

### 5.1 Description

Allows users to create a new task.

### 5.2 Input

* title (string, required, 1-200 chars)
* description (string, optional, max 1000 chars)
* status (enum, default: pending)
* priority (enum, default: medium)

### 5.3 Processing Rules

* Associate task with `user_id` from JWT
* Auto-generate `id`
* Set `created_at` and `updated_at` timestamps

### 5.4 Output

* Success: Task object with all fields
* Failure: Validation error or unauthorized access

---

## 6. Read / List Tasks

### 6.1 Description

Retrieve tasks for the authenticated user.

### 6.2 Input

* Optional query: status filter (`all|pending|in_progress|completed`)
* Optional query: sort field (`created_at|title|priority`)

### 6.3 Processing Rules

* Only return tasks where `user_id` matches JWT
* Apply filters and sorting

### 6.4 Output

* Success: Array of task objects
* Failure: Unauthorized or query error

---

## 7. Update Task

### 7.1 Description

Allows user to update a task's title, description, status, or priority.

### 7.2 Input

* task `id` (required)
* Fields to update: title, description, status, priority

### 7.3 Processing Rules

* Verify task ownership via `user_id`
* Update `updated_at` timestamp
* Reject update if task does not exist or user is unauthorized

### 7.4 Output

* Success: Updated task object
* Failure: Not found / Unauthorized / Validation error

---

## 8. Delete Task

### 8.1 Description

Allows user to delete a task.

### 8.2 Input

* task `id` (required)

### 8.3 Processing Rules

* Verify task ownership
* Remove task from database

### 8.4 Output

* Success: Confirmation message
* Failure: Not found / Unauthorized

---

## 9. Toggle Completion

### 9.1 Description

Mark a task as completed or pending.

### 9.2 Input

* task `id` (required)

### 9.3 Processing Rules

* Verify task ownership
* Flip `completed` boolean
* Update `updated_at`

### 9.4 Output

* Success: Updated task object
* Failure: Not found / Unauthorized

---

## 10. Error Handling

* Unauthorized access: 401 Unauthorized
* Task not found: 404 Not Found
* Validation errors: 400 Bad Request

All responses should be structured JSON objects with `error` or `message` fields.

---

## 11. Security & Ownership

* Task ownership enforced at all times
* JWT token required for all task operations
* No user may access another user’s tasks

---

## 12. Acceptance Criteria

* Users can create, read, update, delete, and complete tasks
* Only tasks owned by the authenticated user are visible
* API enforces all validation and ownership rules
* Timestamps are correctly updated on creation and modification

---

## 13. Future Enhancements (Out of Scope)

* Due dates & reminders
* Task collaboration / sharing
* Task prioritization algorithms
* AI-based task suggestions