# WriteSpace - Modern MERN Blogging Platform

## 📚 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development Guide](#development-guide)
- [Deployment Guide](#deployment-guide)
- [SEO Implementation](#seo-implementation)
- [Best Practices](#best-practices)

## 🎯 Project Overview

WriteSpace is a production-ready, full-stack blogging platform built with the MERN stack. It features a modern, minimal UI with support for rich content creation, social features, and comprehensive SEO optimization.

**Demo Colors:**
- Warm White: #FDFBF7
- Soft Beige: #E5D7C8
- Sage Green: #C4B5A0
- Light Peach: #F5E6D3
- Pale Lavender: #E8E2F0

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **TipTap/React Quill** - Rich text editor
- **React Helmet Async** - SEO meta tags
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Zod** - Input validation
- **Helmet** - Security headers
- **Morgan** - Logging

## ✨ Core Features

### 1. **Authentication**
- User registration & login
- JWT with HTTP-only cookies
- Password reset via email
- Email verification
- Google OAuth ready
- Role-based access (Reader, Author, Admin)

### 2. **Blogging**
- Create, edit, delete blogs
- Draft & publish modes
- Rich text editor with markdown
- Featured image uploads
- Category & tag organization
- Auto-save functionality
- Estimated reading time
- Slug-based URLs

### 3. **User Features**
- User profiles with cover image
- Bio and social links
- Follow/unfollow authors
- User dashboard with stats
- Bookmark blogs
- Reading history
- Profile picture upload

### 4. **Community**
- Nested comments with replies
- Comment likes
- User following system
- Trending blogs section
- Related articles

### 5. **Discovery**
- Full-text search
- Filter by category/tags
- Sort by latest/popular/trending
- Infinite scroll pagination
- Featured authors

### 6. **SEO**
- Dynamic meta tags
- Open Graph support
- Twitter cards
- Sitemap generation
- Proper heading hierarchy
- Lazy image loading

## 📁 Project Structure

```
WriteSpace/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # MongoDB connection
│   │   │   ├── constants.js      # App constants
│   │   │   └── cloudinary.js     # Image service
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Blog.js
│   │   │   ├── Comment.js
│   │   │   ├── Category.js
│   │   │   ├── Tag.js
│   │   │   ├── Notification.js
│   │   │   ├── Bookmark.js
│   │   │   ├── Follower.js
│   │   │   └── ReadingHistory.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── blogController.js
│   │   │   └── commentController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── blogRoutes.js
│   │   │   └── commentRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification
│   │   │   ├── error.js          # Error handling
│   │   │   └── rateLimiter.js    # Rate limiting
│   │   ├── validators/
│   │   │   ├── userValidator.js
│   │   │   ├── blogValidator.js
│   │   │   └── commentValidator.js
│   │   ├── utils/
│   │   │   ├── tokenUtils.js
│   │   │   ├── stringUtils.js
│   │   │   ├── emailUtils.js
│   │   │   └── uploadUtils.js
│   │   ├── services/             # Business logic
│   │   ├── server.js             # App entry point
│   │   └── config.env.example
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── providers/
│   │   │   │   └── ToastProvider.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   └── FilterPanel.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── BlogDetail.jsx
│   │   │   ├── CreateBlog.jsx
│   │   │   ├── EditBlog.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Bookmarks.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── auth/
│   │   │       ├── Login.jsx
│   │   │       ├── Register.jsx
│   │   │       ├── ForgotPassword.jsx
│   │   │       └── ResetPassword.jsx
│   │   ├── context/
│   │   │   └── store.js          # Zustand stores
│   │   ├── services/
│   │   │   ├── api.js            # Axios instance
│   │   │   └── services.js       # API calls
│   │   ├── utils/
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .gitignore
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
└── README.md
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email service)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/writespace
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

5. **Start development server:**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
VITE_API_URL=http://localhost:5000/api
```

4. **Start dev server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📡 API Documentation

### Authentication Endpoints

**POST /api/auth/register**
- Register new user
- Body: `{ username, email, password, firstName, lastName }`

**POST /api/auth/login**
- User login
- Body: `{ email, password }`

**POST /api/auth/logout**
- Logout user (requires auth)

**POST /api/auth/forgot-password**
- Request password reset
- Body: `{ email }`

**POST /api/auth/reset-password/:token**
- Reset password with token
- Body: `{ password, confirmPassword }`

**GET /api/auth/me**
- Get current user (requires auth)

### Blog Endpoints

**GET /api/blogs** - Get all blogs (paginated)
- Query params: `page, limit, category, tags, sort`

**POST /api/blogs** - Create blog (requires auth)
- Body: Blog data

**GET /api/blogs/:slug** - Get blog by slug

**PUT /api/blogs/:blogId** - Update blog (requires auth)

**DELETE /api/blogs/:blogId** - Delete blog (requires auth)

**POST /api/blogs/:blogId/like** - Toggle like (requires auth)

**POST /api/blogs/:blogId/bookmark** - Toggle bookmark (requires auth)

**GET /api/blogs/search** - Search blogs
- Query params: `query, page, limit`

### User Endpoints

**GET /api/users/profile/:username** - Get user profile

**PUT /api/users/update-profile** - Update profile (requires auth)

**POST /api/users/upload-profile-picture** - Upload profile pic (requires auth)

**POST /api/users/follow/:userId** - Follow user (requires auth)

**DELETE /api/users/unfollow/:userId** - Unfollow user (requires auth)

**GET /api/users/dashboard** - Get user dashboard (requires auth)

### Comment Endpoints

**GET /api/blogs/:blogId/comments** - Get blog comments

**POST /api/blogs/:blogId/comments** - Create comment (requires auth)

**PUT /api/blogs/:blogId/comments/:commentId** - Update comment (requires auth)

**DELETE /api/blogs/:blogId/comments/:commentId** - Delete comment (requires auth)

**POST /api/blogs/:blogId/comments/:commentId/like** - Like comment (requires auth)

## 🗄 Database Schema

### User Schema
```javascript
{
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (hashed),
  firstName: String,
  lastName: String,
  bio: String,
  profileImage: String,
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
    instagram: String
  },
  role: String (reader|author|admin),
  isEmailVerified: Boolean,
  isOAuthUser: Boolean,
  googleId: String,
  followersCount: Number,
  followingCount: Number,
  postsCount: Number,
  notifications: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Schema
```javascript
{
  title: String (required, unique slug),
  slug: String (unique, indexed),
  excerpt: String,
  content: String (required),
  markdown: String,
  featuredImage: String,
  author: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  tags: [ObjectId] (ref: Tag),
  status: String (draft|published|archived),
  publishedAt: Date,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  viewsCount: Number,
  likesCount: Number,
  commentsCount: Number,
  bookmarksCount: Number,
  readingTimeMinutes: Number,
  likedBy: [ObjectId],
  bookmarkedBy: [ObjectId],
  commentsEnabled: Boolean,
  isFeatured: Boolean,
  relatedArticles: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## 💻 Development Guide

### Adding New Features

1. **Create database model** in `backend/src/models/`
2. **Create validators** in `backend/src/validators/`
3. **Create controller** in `backend/src/controllers/`
4. **Create routes** in `backend/src/routes/`
5. **Create services** in `frontend/src/services/`
6. **Create components/pages** in `frontend/src/`
7. **Add to Zustand store** if needed

### Authentication Flow

1. User registers/logs in
2. Server validates credentials and generates JWT
3. JWT stored in httpOnly cookie and localStorage
4. Axios interceptor adds token to all requests
5. Server verifies token on protected routes
6. Token auto-refresh on expiration

### State Management (Zustand)

```javascript
// Using Zustand stores
import { useAuthStore, useBlogStore } from './context/store'

const { user, isAuthenticated, logout } = useAuthStore()
const { blogs, setBlogs } = useBlogStore()
```

### Error Handling

- Centralized error middleware catches all errors
- Validation errors return 422 status
- Authentication errors return 401
- Authorization errors return 403
- Server errors return 500 with details in dev mode

## 🚢 Deployment Guide

### Vercel (Frontend)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically on push

### Render/Railway (Backend)

1. Create account and new Web Service
2. Connect MongoDB Atlas
3. Set environment variables
4. Deploy from GitHub

### Database (MongoDB Atlas)

1. Create cluster
2. Add IP whitelist
3. Create database user
4. Get connection string

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=<production_uri>
JWT_SECRET=<strong_random_secret>
FRONTEND_URL=<production_domain>
CORS_ORIGIN=<production_domain>
```

## 🔍 SEO Implementation

### Meta Tags
- Dynamic title and description per page
- Open Graph tags for social sharing
- Twitter card metadata
- Canonical URLs

### Structured Data
- JSON-LD for blog posts
- Schema.org markup
- Breadcrumb structured data

### Performance
- Image lazy loading
- Code splitting
- Minified bundles
- CDN for static assets

### Best Practices
- Proper heading hierarchy (H1 > H2 > H3)
- Alt text for images
- Mobile-responsive design
- Fast page load times
- XML sitemap generation

## 📋 Best Practices

### Security
- ✓ HTTPS only in production
- ✓ CORS properly configured
- ✓ Rate limiting enabled
- ✓ Input validation with Zod
- ✓ Password hashing with bcrypt
- ✓ Environment variables for secrets
- ✓ Helmet for security headers

### Performance
- ✓ Database indexes on frequently queried fields
- ✓ Pagination for large result sets
- ✓ Caching strategies
- ✓ Lazy loading images
- ✓ Code splitting in frontend
- ✓ Minified production builds

### Code Quality
- ✓ Modular folder structure
- ✓ Reusable components
- ✓ Consistent naming conventions
- ✓ Comprehensive error handling
- ✓ Clear comments for complex logic

### Testing
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow the code style and create a pull request.

## 📞 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Built with ❤️ for writers and readers everywhere**
