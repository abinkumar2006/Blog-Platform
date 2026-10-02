# PenCraft — Full-Stack MERN Blogging Platform with Comments

A modern, full-featured blogging platform built with the **MERN stack** (MongoDB, Express.js, React, Node.js), featuring JWT authentication, rich Markdown editing with live preview, and an interactive discussion system.

Based on the [Building a Full-Stack MERN Blog Application from Scratch tutorial](https://youtu.be/zuye-dYSkS0?si=oyJPMl5MWlLtnejm), enhanced with live markdown previewing, tag filtering, responsive design, and zero-configuration local database support.

---

## 🌟 Key Features

### 🔐 1. User Authentication & Authorization
- **Registration & Login**: Secure password hashing with `bcryptjs` and token generation with `jsonwebtoken` (JWT).
- **Protected Routes**: Navigation guards ensuring only authenticated users can author posts, edit/delete content, or write comments.
- **Profile Management**: Customizable bio, avatar, and authored articles dashboard with aggregate statistics (total likes, views, articles).
- **One-Click Demo Fill**: Quick login buttons for demo accounts (`alex@example.com` or `demo@example.com`) for immediate testing.

### 📝 2. Blog Post Creation & Management (CRUD)
- **Interactive Markdown Editor with Live Preview**:
  - Toolbar for formatting: **Bold**, *Italic*, Headings (`##`), Code blocks, Blockquotes, Bullet lists, Links, Images.
  - Tab modes: **Write**, **Split View** (side-by-side live rendering), and **Full Preview**.
  - Live word and character counters.
- **Rich Metadata**: Categorization (Technology, Web Dev, Programming, AI & ML, etc.), multi-tag support, estimated read time calculation, and automated markdown summary generation.
- **Cover Image Selection**: Instant preset pickers or custom image URL input with preview.
- **Ownership Verification**: Authors can edit or delete their own posts; unauthorized attempts receive HTTP 403 Forbidden.
- **Likes & Views**: View counter and toggleable like button with optimistic frontend updates.

### 💬 3. Interactive Comment Discussion
- **Nested & Reactive Comments**: Real-time comment submission without full-page reloads.
- **Author & Post Owner Moderation**: Comment authors can delete their own comments, and post owners can moderate/delete any comment under their article.
- **Empty States & Unauthenticated Prompts**: Clear call-to-actions prompting guests to log in before participating.

### 🔍 4. Search, Discovery & Filtering
- **Keyword Search**: Server-side RegExp search matching post titles, markdown body content, and tags.
- **Category Filter Chips**: Quick filtering across topics with active category badges.
- **Tag Filtering**: Click any `#tag` across the platform to view related articles.
- **Pagination**: Server-driven pagination with previous/next controls.

---

## 📐 Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | Fast HMR, clean component architecture |
| **Routing** | React Router v7 | Protected routes, dynamic parameter matching |
| **Styling** | Tailwind CSS | Responsive utility classes, modern typography |
| **Icons** | Lucide React | Modern, consistent iconography |
| **Markdown** | react-markdown, remark-gfm | GitHub-flavored markdown parsing & syntax styling |
| **HTTP Client** | Axios | Configured with token interceptors and error handlers |
| **Backend** | Node.js, Express.js | Modular RESTful architecture (MVC pattern) |
| **Database** | MongoDB & Mongoose | Schemas with pre-save hooks, virtuals, and cascading deletion |
| **Database Dev Support** | mongodb-memory-server | Auto-managed local MongoDB instance (runs out of the box without manual DB installation) or connects to MongoDB Atlas |

---

## 📁 Project Structure

```
blog-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & auto-memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # register, login, me, profile
│   │   │   ├── postController.js     # CRUD, search, tags, likes, pagination
│   │   │   └── commentController.js  # create, list, delete comments
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # protect and optionalAuth JWT verification
│   │   │   └── errorHandler.js       # centralized error responses
│   │   ├── models/
│   │   │   ├── User.js               # User schema & bcrypt methods
│   │   │   ├── Post.js               # Post schema, readTime calc, comments count
│   │   │   └── Comment.js            # Comment schema with post & user relations
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth
│   │   │   ├── postRoutes.js         # /api/posts
│   │   │   └── commentRoutes.js      # /api/comments
│   │   ├── utils/
│   │   │   └── seed.js               # Demo dataset seeder
│   │   └── server.js                 # Express app initialization
│   ├── .env.example
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # Axios client with auth interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive navigation & user menu
│   │   │   ├── Footer.jsx
│   │   │   ├── PostCard.jsx          # Article preview card
│   │   │   ├── CommentSection.jsx    # Discussion thread & moderation
│   │   │   ├── MarkdownEditor.jsx    # Split-view live markdown editor
│   │   │   ├── MarkdownRenderer.jsx  # Markdown formatter
│   │   │   └── ProtectedRoute.jsx    # Authentication route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global authentication state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Search, category filters & post grid
│   │   │   ├── PostDetailPage.jsx    # Full article & comments
│   │   │   ├── CreatePostPage.jsx    # New post composer with live preview
│   │   │   ├── EditPostPage.jsx      # Post editor
│   │   │   ├── LoginPage.jsx         # Sign in with demo account buttons
│   │   │   ├── RegisterPage.jsx      # Sign up form
│   │   │   └── ProfilePage.jsx       # User dashboard & published posts
│   │   ├── App.jsx                   # Route configurations
│   │   ├── index.css                 # Tailwind directives & prose styles
│   │   └── main.jsx
│   ├── vite.config.js                # Port 3000 + /api proxy to 5001
│   ├── tailwind.config.js
│   └── package.json
├── package.json                      # Root workspace script
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Launch the Application
From the root project directory:

```bash
npm run dev
```

This runs both the Express REST API backend (`http://localhost:5001`) and the Vite React frontend (`http://localhost:3000`) concurrently.

> **Zero DB Config Required**: On initial boot, the application automatically provisions an in-memory MongoDB daemon and pre-populates it with demo articles, users, and comments!

### 2. (Optional) Connect to MongoDB Atlas or Local MongoDB
If you wish to persist data to a custom MongoDB Atlas cluster or your own local daemon:
1. Open `backend/.env`.
2. Set your `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog-app?retryWrites=true&w=majority
   ```
3. Restart the server. The backend will automatically connect to your Atlas cluster.

---

## 👥 Pre-seeded Demo Accounts

Use these accounts to test authenticated actions immediately without creating a new user:

| Email | Password | Role | Description |
|---|---|---|---|
| `alex@example.com` | `password123` | Author | Has 2 published posts on MERN & Tailwind CSS |
| `sarah@example.com` | `password123` | Author | Has 1 published post on Technical Markdown Writing |
| `demo@example.com` | `password123` | Reader | Ready to test commenting and liking articles |

*(You can also click the "Quick Demo Fill" buttons on the `/login` page)*

---

## 📡 RESTful API Reference

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`username`, `email`, `password`, `bio`).
- `POST /api/auth/login` — Sign in and obtain JWT token (`email`, `password`).
- `GET /api/auth/me` *(Protected)* — Get current user profile details.
- `PUT /api/auth/profile` *(Protected)* — Update username, bio, or avatar.

### Posts Endpoints (`/api/posts`)
- `GET /api/posts` — Get paginated posts. Query params:
  - `search` (keyword)
  - `category` (category name)
  - `tag` (tag name)
  - `author` (user ID)
  - `page` (default 1)
  - `limit` (default 9)
- `GET /api/posts/:id` — Get single post with incremented view count and like status.
- `POST /api/posts` *(Protected)* — Create a new post.
- `PUT /api/posts/:id` *(Protected, Author only)* — Update a post.
- `DELETE /api/posts/:id` *(Protected, Author only)* — Delete a post and its comments.
- `POST /api/posts/:id/like` *(Protected)* — Like or unlike a post.
- `GET /api/posts/metadata/categories` — Get distinct categories and tags.

### Comments Endpoints (`/api/posts/:postId/comments` & `/api/comments/:id`)
- `GET /api/posts/:postId/comments` — Fetch all comments for a post (newest first).
- `POST /api/posts/:postId/comments` *(Protected)* — Add a new comment to a post.
- `DELETE /api/comments/:id` *(Protected, Comment Author OR Post Author)* — Delete comment.
