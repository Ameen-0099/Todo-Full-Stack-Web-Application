# REST API Endpoints Specification (Extended with Authentication)

## 1. Purpose

This document defines the REST API endpoints for Phase II (Web App) of the AI-Driven Todo Application. It covers all task-related endpoints and **authentication endpoints**, including request/response structure, headers, and error codes. This specification is strictly for design purposes; implementation must follow this contract.

All endpoints require JWT authentication unless explicitly stated.

---

## 2. Base URL

* Development: `http://localhost:8000`
* Production: `https://api.example.com`

All endpoints are prefixed with `/api/`

---

## 3. Authentication Overview

* JWT Token required in `Authorization` header for protected endpoints:

```
Authorization: Bearer <token>
```

* Backend verifies JWT signature and expiry
* Invalid tokens return **401 Unauthorized**

---

## 4. Authentication Endpoints

### 4.1 Register User

* **Method:** POST
* **Endpoint:** `/api/register`
* **Request Body:**

```json
{
  "email": "string",
  "password": "string (min 8 chars)"
}
```

* **Response:** 201 Created

```json
{
  "user_id": "uuid",
  "email": "string",
  "token": "jwt_token",
  "created_at": "timestamp"
}
```

* **Errors:** 400 Bad Request (validation failure), 409 Conflict (email exists)

---

### 4.2 Login User

* **Method:** POST
* **Endpoint:** `/api/login`
* **Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

* **Response:** 200 OK

```json
{
  "user_id": "uuid",
  "email": "string",
  "token": "jwt_token"
}
```

* **Errors:** 400 Bad Request, 401 Unauthorized (invalid credentials)

---

### 4.3 Logout User (Client-Side)

* **Method:** POST
* **Endpoint:** `/api/logout`
* **Description:** Client deletes JWT token locally; no server-side token invalidation is required for Phase II
* **Request Body:** Empty
* **Response:** 200 OK

```json
{
  "message": "Logged out successfully"
}
```

* **Errors:** 401 Unauthorized (if token is missing)

---

## 5. Task Endpoints

*(Existing task endpoints remain unchanged)*

* `GET /api/{user_id}/tasks`
* `POST /api/{user_id}/tasks`
* `GET /api/{user_id}/tasks/{id}`
* `PUT /api/{user_id}/tasks/{id}`
* `DELETE /api/{user_id}/tasks/{id}`
* `PATCH /api/{user_id}/tasks/{id}/complete`

---

## 6. Error Codes

| Code | Meaning                                              |
| ---- | ---------------------------------------------------- |
| 400  | Bad Request (validation failure)                     |
| 401  | Unauthorized (invalid or missing JWT)                |
| 404  | Not Found (task does not exist or not owned by user) |
| 409  | Conflict (duplicate email registration)              |
| 500  | Internal Server Error                                |

---

## 7. Notes

* All responses are JSON
* All endpoints enforce user ownership and authentication rules
* JWT token must be verified before any operation