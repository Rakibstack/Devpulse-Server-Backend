# 🚀 DevPulse - Issue Tracker API

A RESTful backend API for managing technical issues and feature requests with authentication, role-based authorization, and secure database operations.

Built with **TypeScript, Express.js, PostgreSQL, JWT Authentication, and RBAC**.

---

## 🌐 Live Demo

🔗 https://devpulse-backend-seven.vercel.app

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- Secure password hashing with bcrypt
- JWT based authentication
- Protected API routes

### 🛡 Role Based Authorization (RBAC)

**Contributor**
- Create issues
- View issues
- Update own issues
- Cannot update non-open issues
- Cannot change issue status

**Maintainer**
- Manage all issues
- Update any issue
- Change issue status
- Control issue workflow

---

## 🛠 Tech Stack

**Backend**
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT
- bcrypt
- Zod

**Database**
- PostgreSQL
- Raw SQL using `pg`

---

## 📁 Project Highlights

- Modular architecture
- Service-controller pattern
- Centralized error handling
- Reusable response utilities
- Type-safe development
- Clean API structure

---

## 👨‍💻 Author

**Rakibul Hasan Rakib**

Backend Developer | Full Stack Developer