# Todo Management API

A secure backend REST API for a Todo application built using **NestJS**, **PostgreSQL**, and **JWT authentication**.

This project supports user authentication, role-based access control, todo management, and admin-level user management.

---

## 🚀 Tech Stack

- Node.js
- NestJS
- PostgreSQL
- TypeORM
- JWT Authentication
- Swagger (OpenAPI)

---

## 🎯 Features

### Authentication
- User signup & login
- Password hashing
- JWT-based authentication
- Logout with token invalidation

### User Management
- View own profile
- Update own profile
- Soft delete own account
- Soft-deleted users cannot login

### Todo Management
- Create todos
- Get own todos (paginated)
- Update own todos
- Delete own todos
- Users cannot access others’ todos

### Admin Management
- List all users
- Update any user
- Soft delete any user
- Role-based access control (ADMIN only)

---

## ⚙️ Local Setup

### 1️⃣ Install dependencies
```bash
pnpm install
```

### 2️⃣ Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=todo_user
DB_PASSWORD=your_db_password
DB_NAME=todo_db

JWT_SECRET=change_me_to_random_string
JWT_EXPIRES_IN=15m
```

### 3️⃣ Start the server
```bash
pnpm run start:dev
```

---

## 📚 API Documentation

Swagger UI:
```
http://localhost:3000/docs
```

Health check:
```
http://localhost:3000/health
```

---

## 🔐 Authentication Flow (Swagger)

1. `POST /auth/signup` → Create user  
2. `POST /auth/login` → Copy `accessToken`  
3. Click **Authorize** in Swagger  
4. Paste JWT token  
5. Call protected APIs  

---

## 📌 API Endpoints

### Authentication
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### User APIs
- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me` (soft delete)

### Todo APIs
- `POST /todos`
- `GET /todos?page=1&limit=10`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

### Admin APIs (ADMIN only)
- `GET /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`

---

## 👑 Admin Setup

To promote a user to ADMIN role, run the following query in PostgreSQL:

```sql
UPDATE users SET role='ADMIN' WHERE email='your_email@test.com';
```

Login again to receive a new JWT token with ADMIN role.

---

## 📝 Notes

- Passwords are securely hashed
- Soft delete is implemented for users
- JWT tokens expire after 15 minutes
- Role-based access control enforced
- `synchronize: true` is enabled for development only

---

## ✅ Project Status

✔ All mandatory requirements implemented  
✔ Plus points: NestJS, Swagger, validation, RBAC  

---

## 👩‍💻 Author

**Prajakta Ukirde**
