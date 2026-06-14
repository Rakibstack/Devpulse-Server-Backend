
#  DevPulse - Issue Tracker API

A backend REST API for managing internal technical issues and feature requests.  
DevPulse allows users to register, authenticate, create issues, track progress, and manage issues based on user roles.

Built with clean architecture, JWT authentication, role-based authorization, and PostgreSQL.

---

##  Live Demo : https://devpulse-backend-seven.vercel.app

---

## 📌 Features

### Authentication
- User registration
- Secure password hashing using bcrypt
- User login
- JWT based authentication
- Protected routes

### Authorization (RBAC)
Two user roles:

#### Contributor
- Create issues
- View issues
- Update own issues
- Cannot update closed/resolved issues
- Cannot change issue status

#### Maintainer
- View all issues
- Update any issue
- Change issue status
- Manage issue lifecycle

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT
- bcrypt
- Zod  Validation

### Database

- PostgreSQL
- Raw SQL queries using `pg`

---

👨‍💻 Author

Rakibul Hasan Rakib

Backend Developer | Full-Stack Developer
