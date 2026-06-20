# 📋 Sambhalo

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextauth.js&logoColor=white)

**Sambhalo** (meaning "manage" or "take care of") is a full-stack, Next.js App Router-based Kanban board application designed to streamline personal task management. It offers a secure, intuitive, and highly responsive interface for organizing workflows with seamless drag-and-drop capabilities.

---

## ✨ Features

- **Secure Authentication:** Integrated NextAuth.js supporting both Google OAuth and passwordless Email Magic Links.
- **Robust Database:** MongoDB paired with Mongoose for structured, scalable data modeling.
- **Modern UI/UX:** Clean, dark-mode optimized interface built with Tailwind CSS and Lucide React icons.
- **RESTful API:** A fully functional backend API for managing boards, columns, tasks, and complex drag-and-drop reordering logic.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React 19, Tailwind CSS v4, Lucide React
- **Backend:** Next.js Route Handlers, Node.js
- **Database:** MongoDB, Mongoose, @auth/mongodb-adapter
- **Authentication:** NextAuth.js (v4), Nodemailer (for magic links)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js installed, along with a MongoDB cluster (e.g., MongoDB Atlas) and a Google Cloud Console project for OAuth credentials.

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email / Magic Link (SMTP config)
EMAIL_SERVER_USER=your_email_user
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@example.com
```

### Installation & Running Locally

1. Clone the repository and install dependencies:
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Status & Roadmap

The project has established a rock-solid foundation with a complete backend architecture, authentication flow, and initial UI setup. 

### ✅ Completed
- Next.js App Router & Tailwind setup.
- MongoDB integration and Mongoose schemas (`Board`, `Column`, `Task`).
- Login page UI with Google/Email authentication.
- Full API routes for CRUD operations and Kanban reordering logic.

### 🚧 Coming Soon (Work in Progress)
- **Interactive Drag-and-Drop Kanban UI:** Implementing the frontend visual board using a DnD library.
- **Optimistic UI Updates:** Enhancing perceived performance during task creation and column reordering.
- **Task Management Modals:** Interfaces for editing task details and deleting items.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.
