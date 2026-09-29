# 🚀 TaskFlow AI — AI-Powered Task Manager

> A premium, enterprise-grade Task Management application built with **Java Spring Boot**, **React + Vite**, and **Groq AI (LLaMA 3.3 70B)** — featuring **KedAI**, a personal AI assistant built by **Kedari**.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green)
![React](https://img.shields.io/badge/React-Vite-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue)
![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-purple)

---

## ✨ Features

### 🤖 KedAI — Personal AI Assistant
- **KedAI Copilot Chat** — Conversational AI to create tasks using natural language
- **Quick AI Outline** — Auto-generate task description, priority, estimated time
- **Smart Form Fill** — KedAI fills your form automatically from one sentence

### 📋 Task Management
- **List View** — Table view with search, filter by status, priority, category
- **Kanban Board** — Drag & drop tasks between Pending, In Progress, Completed
- **Task Categories** — Work, Personal, Urgent, Coding, Health
- **Edit & Delete** — Full CRUD with confirmation modals

### 🔐 Security
- **JWT Authentication** — Secure token-based sessions
- **BCrypt Password Hashing** — Passwords never stored in plain text
- **Spring Security** — Backend route protection
- **Protected Routes** — React-side auth guards

### 🔗 Blockchain Audit Ledger
- **SHA-256 Hashing** — Every task change generates a cryptographic hash
- **Immutable Chain** — Each block links to previous hash (blockchain-style)
- **Tamper Detection** — Verify task history integrity with one click
- **Full Audit Trail** — Complete create/update history with timestamps

### 📊 Dashboard & Analytics
- **Live Stats** — Total, Pending, Completed, High Priority counts
- **Productivity Chart** — Weekly trend visualization (Recharts)
- **AI Insight Panel** — Personalized productivity score

### 🎨 Premium UI/UX
- **Dark Theme** — Modern SaaS design with Ice Neon (`#00f2ff`) accents
- **Glassmorphism** — Frosted glass card effects
- **Framer Motion** — Smooth animations and transitions
- **Ant Design** — Professional component library
- **Fully Responsive** — Desktop and mobile friendly

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Vite, Ant Design, Axios |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Spring Boot 3.2.5, Java 17 |
| **Security** | Spring Security, JWT (jjwt 0.11.5) |
| **Database** | MySQL 8.0, Spring Data JPA, Hibernate |
| **AI API** | Groq API (LLaMA 3.3 70B Versatile) |
| **Hashing** | SHA-256 (Java MessageDigest) |

---

## 📁 Project Structure

```
AI-Task-Manager/
├── README.md
│
├── frontend/                           # React + Vite Frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── AppLayout.jsx       # Sidebar + Header layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # JWT Auth state management
│   │   ├── pages/
│   │   │   ├── CreateTask.jsx          # Task form + KedAI chat
│   │   │   ├── Dashboard.jsx           # Stats + Charts + AI insight
│   │   │   ├── Login.jsx               # Login page with animations
│   │   │   ├── Register.jsx            # Register page
│   │   │   └── Tasks.jsx               # List view + Kanban board
│   │   ├── services/
│   │   │   └── api.js                  # Axios instance + JWT interceptors
│   │   ├── App.css                     # Global styles + glassmorphism
│   │   ├── App.jsx                     # Routes + protected route guards
│   │   ├── index.css                   # Base CSS reset
│   │   └── main.jsx                    # React entry point
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── backend/                            # Spring Boot Backend
    └── src/main/java/com/aitaskmanager/
        ├── BackendApplication.java      # Main entry point
        ├── config/
        │   └── WebConfig.java          # CORS configuration
        ├── controller/
        │   ├── AIController.java       # /api/ai/** endpoints
        │   ├── AuthController.java     # /api/auth/** endpoints
        │   └── TaskController.java     # /api/tasks/** endpoints
        ├── dto/
        │   ├── AIRequest.java
        │   ├── JwtResponse.java
        │   ├── LoginRequest.java
        │   ├── RegisterRequest.java
        │   ├── TaskDTO.java
        │   └── TaskHistoryDTO.java
        ├── model/
        │   ├── AILog.java              # AI query logs entity
        │   ├── Task.java               # Task entity
        │   ├── TaskHistory.java        # Blockchain audit blocks entity
        │   └── User.java               # User entity
        ├── repository/
        │   ├── AILogRepository.java
        │   ├── TaskHistoryRepository.java
        │   ├── TaskRepository.java
        │   └── UserRepository.java
        ├── security/
        │   ├── AuthTokenFilter.java    # JWT request filter
        │   ├── JwtUtils.java           # JWT generate/validate
        │   ├── SecurityConfig.java     # Spring Security config
        │   ├── UserDetailsImpl.java    # UserDetails implementation
        │   └── UserDetailsServiceImpl.java
        └── service/
            ├── AuthService.java        # Register/Login logic
            ├── GeminiService.java      # Groq API integration
            └── TaskService.java        # SHA-256 blockchain logic
    └── src/main/resources/
        └── application.properties      # DB, JWT, Groq config
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- MySQL 8.0+
- Eclipse IDE (for backend)
- VS Code (for frontend)
- Groq API Key — free at [console.groq.com](https://console.groq.com)

---

### 1️⃣ Database Setup

Open MySQL and run:
```sql
CREATE DATABASE ai_task_manager;
```
> Tables are **auto-created** by Spring Boot (`ddl-auto=update`). No SQL script needed!

---

### 2️⃣ Backend Setup (Eclipse)

Open `backend/src/main/resources/application.properties` and update:

```properties
# ===============================
# DATABASE CONFIGURATION
# ===============================
spring.datasource.url=jdbc:mysql://localhost:3306/ai_task_manager?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# ===============================
# JWT CONFIGURATION
# ===============================
aitask.app.jwtSecret=TaskFlowAIPremiumSecretKeyForJWTGenerationMustBeLongEnough
aitask.app.jwtExpirationMs=86400000

# ===============================
# GROQ AI CONFIGURATION
# ===============================
aitask.gemini.api-key=YOUR_GROQ_API_KEY
aitask.gemini.url=https://api.groq.com/openai/v1/chat/completions

# ===============================
# SERVER CONFIGURATION
# ===============================
server.port=8081
```

Run in Eclipse:
```
Right-click project → Run As → Spring Boot App
```

---

### 3️⃣ Frontend Setup (VS Code)

```bash
cd frontend
npm install
npm run dev
```

Open browser: [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filters) |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| GET | `/api/tasks/{id}/history` | Get blockchain audit ledger |

### KedAI (`/api/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate task details from title |
| POST | `/api/ai/chat` | KedAI conversational chat |

---

## 🤖 KedAI — AI Workflow

```
User enters task title
        ↓
Frontend → POST /api/ai/generate
        ↓
GeminiService (Groq API call)
        ↓
Groq LLaMA 3.3 70B returns JSON
        ↓
Frontend auto-fills form fields
        ↓
User reviews → Save Task
```

**KedAI Chat Example Commands:**
```
"Create a high priority task: Fix login bug by Friday"
"Generate a coding task for API integration"
"What should I work on today?"
```

---

## 🔗 Blockchain Audit Trail

Every task change creates a new block:

```
Block #0 (CREATED)     Block #1 (UPDATED)     Block #2 (COMPLETED)
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Hash: ee390  │──────▶│ Hash: ab123  │──────▶│ Hash: ff456  │
│ Prev: 00000  │       │ Prev: ee390  │       │ Prev: ab123  │
│ Action:CREATE│       │ Action:UPDATE│       │ Action:UPDATE│
└──────────────┘       └──────────────┘       └──────────────┘
      ✅                      ✅                      ✅
              All hashes match = VERIFIED ✅

If tampered → hash mismatch = DETECTED ❌
```

---

## 🌐 Application Pages

| Page | URL | Description |
|------|-----|-------------|
| Login | `http://localhost:5173/login` | User login |
| Register | `http://localhost:5173/register` | New user registration |
| Dashboard | `http://localhost:5173/` | Stats, charts, AI insight |
| Tasks | `http://localhost:5173/tasks` | List + Kanban view |
| Create Task | `http://localhost:5173/create-task` | Form + KedAI chat |

---

## 👨‍💻 Developer

**Kedari** — Java Full Stack Developer

> Built as a premium portfolio project demonstrating:
> - Full Stack Java Development (Spring Boot + React)
> - AI Integration with Groq API (LLaMA 3.3 70B)
> - Blockchain-style Audit Trail with SHA-256
> - KedAI — Personal AI Task Assistant
> - Enterprise-grade Security with JWT

---

*© 2025 Kedari — TaskFlow AI. All rights reserved.*
