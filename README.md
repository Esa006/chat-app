# ⚡ ChatFlow — Real-Time Chat Application

A modern, high-performance real-time chat application built with **React (TypeScript + Vite)** on the frontend and **Laravel 12** on the backend, featuring instant WebSocket messaging powered by **Laravel Reverb**, secure authentication via **Laravel Sanctum**, and a relational data layer backed by **MySQL**.

---

## 📸 Preview

![ChatFlow UI Preview](https://raw.githubusercontent.com/placeholder/preview.jpg)
*(Or view the generated preview artifact in the project workspace)*

---

## 🚀 Key Features

- **⚡ Real-Time Messaging**: Instant peer-to-peer and group messaging via WebSockets (Laravel Reverb + Laravel Echo) with zero polling.
- **🔐 Secure Authentication**: Token-based authentication using Laravel Sanctum with auto-login and session persistence.
- **💬 Direct & Group Chats**: Support for 1-on-1 private conversations as well as multi-participant group chats.
- **🟢 Live Online Presence**: Track users' active status in real time via presence channels.
- **✍️ Typing Indicators**: Real-time typing status with smooth animated 3-dot bounce indicators.
- **📬 Read Receipts & Unread Badges**: Visual indicators for delivered/read messages and conversation badges.
- **🔍 Quick User Discovery**: Search registered users and immediately start new conversations without duplicate channel creation.
- **🎨 Glassmorphic Dark UI**: Custom-styled dark aesthetic with violet/purple gradients, micro-interactions, and fluid transitions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom Design System, Dark Mode, Micro-animations)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Real-Time Client**: [Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation) + [Pusher-JS](https://github.com/pusher/pusher-js)

### Backend
- **Framework**: [Laravel 12](https://laravel.com/)
- **Authentication**: [Laravel Sanctum](https://laravel.com/docs/sanctum)
- **WebSocket Server**: [Laravel Reverb](https://reverb.laravel.com/)
- **Broadcasting**: Laravel Event Broadcasting (`MessageSent` event)
- **Database**: MySQL 8.x / MariaDB (via XAMPP)
- **Authorization**: Laravel Policies (`ConversationPolicy`)

---

## 📁 Project Architecture

```
chat-app/
├── backend/                  # Laravel 12 API Application
│   ├── app/
│   │   ├── Events/           # MessageSent broadcast event
│   │   ├── Http/Controllers/ # Auth, Conversation, Message, User controllers
│   │   ├── Models/           # User, Conversation, Message models
│   │   └── Policies/         # ConversationPolicy for participant isolation
│   ├── config/               # cors.php, reverb.php, sanctum.php
│   ├── database/
│   │   ├── migrations/       # Users, Conversations, Messages schema
│   │   └── seeders/          # DemoSeeder with test accounts & chats
│   └── routes/
│       ├── api.php           # REST API endpoints
│       └── channels.php      # Private & presence broadcast channels
│
├── frontend/                 # React + TypeScript + Vite Client
│   ├── src/
│   │   ├── components/       # MessageBubble, MessageInput, Sidebar, TypingIndicator
│   │   ├── context/          # AuthContext, EchoContext
│   │   ├── hooks/            # useMessages, useConversations, usePresence
│   │   ├── pages/            # Login, Register, ChatRoom
│   │   ├── services/         # api.ts (Axios), echo.ts (Laravel Echo)
│   │   └── index.css         # Dark theme design system
│   └── .env                  # Frontend configuration
│
└── start.ps1                 # Automated PowerShell script to launch all services
```

---

## 📋 Prerequisites

Before running the application, make sure you have installed:
1. **PHP 8.2+** (included in [XAMPP](https://www.apachefriends.org/))
2. **Composer** (or use the included `composer.ps1` helper)
3. **Node.js 18+** & **npm**
4. **MySQL / MariaDB** (running via XAMPP Control Panel)

---

## ⚙️ Installation & Setup

### 1. Database Setup
Start **MySQL** from your XAMPP Control Panel. Then ensure the database exists:
```bash
# In your terminal or via phpMyAdmin:
mysql -u root -e "CREATE DATABASE IF NOT EXISTS chatflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Backend Setup
Navigate to the `backend/` directory:
```powershell
cd backend

# Copy environment template if .env does not exist
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database & Reverb in .env:
# DB_CONNECTION=mysql
# DB_DATABASE=chatflow
# DB_USERNAME=root
# DB_PASSWORD=
# BROADCAST_CONNECTION=reverb
# REVERB_APP_ID=chatflow-app
# REVERB_APP_KEY=chat-key
# REVERB_APP_SECRET=chat-secret
# REVERB_HOST="127.0.0.1"
# REVERB_PORT=8080

# Run migrations and seed test data
php artisan migrate --force
php artisan db:seed --class=DemoSeeder --force
```

### 3. Frontend Setup
Navigate to the `frontend/` directory:
```powershell
cd ../frontend

# Install dependencies
npm install

# Verify .env contents
# VITE_API_URL=http://localhost:8000
# VITE_REVERB_APP_KEY=chat-key
# VITE_REVERB_HOST=127.0.0.1
# VITE_REVERB_PORT=8080
```

---

## 🚀 Running the Application

### Option A: One-Click Launch (Recommended)
From the root directory (`chat-app/`), run the startup PowerShell script:
```powershell
.\start.ps1
```
This script checks MySQL connectivity and automatically spawns the three required services:
1. **Laravel API**: `http://localhost:8000`
2. **Reverb WebSocket Server**: `ws://127.0.0.1:8080`
3. **Vite Frontend**: `http://localhost:5173`

---

### Option B: Manual Launch (3 Terminals)

#### Terminal 1 — Laravel Backend
```powershell
cd backend
php artisan serve
```

#### Terminal 2 — Reverb WebSocket Server
```powershell
cd backend
php artisan reverb:start --host=127.0.0.1 --port=8080
```

#### Terminal 3 — Vite Frontend
```powershell
cd frontend
npm run dev
```

---

## 👥 Demo User Credentials

The database comes pre-seeded with sample users and conversations:

| Name | Email | Password |
|---|---|---|
| **Alice Johnson** | `alice@example.com` | `password123` |
| **Bob Smith** | `bob@example.com` | `password123` |
| **Carol White** | `carol@example.com` | `password123` |

> **Testing Real-Time:**  
> Open two separate browser windows (or one normal and one Incognito/Private window):
> 1. Log in as **Alice** in Window 1.
> 2. Log in as **Bob** in Window 2.
> 3. Send a message from Alice to Bob — notice how it appears instantly in Bob's window without any page refresh!

---

## 📡 Real-Time Broadcasting Flow

```text
[User Alice Types Message]
           │
           ▼
[POST /api/conversations/{id}/messages]
           │
           ▼
[Laravel Controller Persists Message to MySQL]
           │
           ▼
[Fires MessageSent Event (ShouldBroadcast)]
           │
           ▼
[Laravel Reverb WebSocket Server (Port 8080)]
           │
           ▼
[Private Channel: private-conversation.{id}]
           │
           ▼
[Bob's Laravel Echo Listener receives event]
           │
           ▼
[React Appends Message to State Optimistically]
```

---

## 🛣️ API Endpoints Summary

### Authentication
- `POST /api/register` — Create new account & return Sanctum token
- `POST /api/login` — Authenticate & set user online status
- `POST /api/logout` — Revoke token & mark user offline
- `GET /api/me` — Retrieve current authenticated user profile

### Conversations & Messages
- `GET /api/conversations` — List conversations for authenticated user with last messages and unread counts
- `POST /api/conversations` — Start a direct or group conversation
- `GET /api/conversations/{id}` — Get conversation details and participants
- `GET /api/conversations/{id}/messages` — Paginated message history
- `POST /api/conversations/{id}/messages` — Send a message (broadcasts `MessageSent`)
- `POST /api/conversations/{id}/read` — Mark conversation messages as read

### Users
- `GET /api/users?search={query}` — Search users by name or email to start a conversation

---

## 🛡️ Security & Authorization

- **Sanctum Middleware**: All API endpoints (except login and register) are protected by `auth:sanctum`.
- **Channel Authorization**: `routes/channels.php` verifies that a user belongs to the conversation before authorizing access to `private-conversation.{id}`.
- **Conversation Policy**: `ConversationPolicy` prevents unauthorized users from querying message histories of chats they do not participate in.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
