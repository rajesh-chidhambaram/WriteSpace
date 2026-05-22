# 📝 WriteSpace - Modern MERN Blogging Platform

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-16+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4+-lightgrey)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**A production-ready, full-stack blogging platform built with the MERN stack**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 🎯 What is WriteSpace?

WriteSpace is a modern, minimal blogging platform designed for writers and readers. It combines elegant design with powerful features to create the perfect environment for content creation and discovery.

Perfect for:
- ✨ Portfolio projects
- 🎓 Learning full-stack development
- 💼 Internship evaluations
- 🚀 Starting a blog/publication

---

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- JWT authentication with HTTP-only cookies
- Password reset via email
- Email verification
- Google OAuth support (ready to integrate)
- Role-based access control (Reader, Author, Admin)

### 📝 Blogging Features
- **Rich Content Creation**: Create blogs with rich text editor
- **Draft & Publish**: Save drafts or publish directly
- **Auto-save**: Never lose your work
- **Categories & Tags**: Organize content
- **Slug-based URLs**: SEO-friendly URLs
- **Reading Time**: Auto-calculated reading time
- **Featured Images**: Upload and manage featured images
- **Markdown Support**: Full markdown support

### 👥 Social Features
- **Follow Authors**: Build communities
- **Comments System**: Nested comments with replies
- **Comment Likes**: Engage with community
- **User Profiles**: Customizable user profiles
- **Bookmarks**: Save articles for later
- **Reading History**: Track what you've read

### 🔍 Discovery & Search
- **Full-Text Search**: Powerful search functionality
- **Category & Tag Filters**: Filter by interest
- **Trending Section**: See what's popular
- **Related Articles**: Discover similar content
- **Sort Options**: By latest, popular, or trending

### 📊 Dashboard
- **Blog Statistics**: Views, likes, comments
- **Management Tools**: Edit, delete, draft blogs
- **Author Stats**: Total posts, followers, following
- **Quick Actions**: Fast access to common tasks

### 🎨 Design Excellence
- **Modern UI**: Clean, minimal design
- **Warm Palette**: Soft colors (beige, sage green, lavender)
- **Fully Responsive**: Mobile, tablet, desktop
- **Smooth Animations**: Framer Motion animations
- **Light Theme Only**: Optimized for reading
- **Accessibility**: WCAG compliant

### 🔍 SEO Optimization
- **Dynamic Meta Tags**: Per-page SEO
- **Open Graph**: Social sharing optimization
- **Twitter Cards**: Twitter integration
- **Structured Data**: JSON-LD markup
- **Sitemap Generation**: SEO-friendly
- **Lazy Loading**: Performance optimized
- **Proper Heading Hierarchy**: H1, H2, H3 structure

---

## 🛠 Tech Stack

### Frontend
```
React 18              - UI Library
Vite                  - Build Tool
Tailwind CSS          - Styling
React Router v6       - Routing
Zustand               - State Management
Axios                 - HTTP Client
Framer Motion         - Animations
TipTap/React Quill    - Rich Text Editor
React Helmet Async    - SEO Meta Tags
React Hot Toast       - Notifications
```

### Backend
```
Node.js               - Runtime
Express.js            - Web Framework
MongoDB               - Database
Mongoose              - ODM
JWT                   - Authentication
Bcryptjs              - Password Hashing
Cloudinary            - Image CDN
Zod                   - Validation
Helmet                - Security
Morgan                - Logging
```

### Infrastructure
```
MongoDB Atlas         - Database Hosting
Cloudinary            - Image Storage
Vercel                - Frontend Hosting
Render/Railway        - Backend Hosting
Gmail SMTP            - Email Service
```

---

## 🎨 Design System

### Color Palette
- **Warm White**: `#FDFBF7` - Main background
- **Soft Beige**: `#E5D7C8` - Accents
- **Sage Green**: `#C4B5A0` - Primary CTA
- **Light Peach**: `#F5E6D3` - Highlights
- **Pale Lavender**: `#E8E2F0` - Secondary
- **Dark Gray**: `#3E3937` - Text

### Typography
- **Sans**: Inter (body text)
- **Display**: Poppins (headings)
- **Mono**: Manrope (code)

### Components
- Rounded cards with subtle shadows
- Smooth transitions and hover effects
- Skeleton loaders for loading states
- Toast notifications
- Modal dialogs

---

## 📋 Project Structure

```
WriteSpace/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/          # Configuration files
│   │   ├── 📁 models/          # Mongoose schemas
│   │   ├── 📁 controllers/      # Route handlers
│   │   ├── 📁 routes/           # API routes
│   │   ├── 📁 middleware/       # Express middleware
│   │   ├── 📁 validators/       # Zod schemas
│   │   ├── 📁 utils/            # Utility functions
│   │   ├── 📁 services/         # Business logic
│   │   └── 📄 server.js         # App entry point
│   ├── 📄 package.json
│   ├── 📄 .env.example
│   └── 📄 .gitignore
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   ├── 📁 pages/            # Page components
│   │   ├── 📁 context/          # Zustand stores
│   │   ├── 📁 services/         # API services
│   │   ├── 📁 utils/            # Helpers
│   │   ├── 📁 styles/           # Global styles
│   │   ├── 📄 App.jsx           # Main app
│   │   └── 📄 main.jsx          # Entry point
│   ├── 📄 index.html
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 package.json
│   └── 📄 .gitignore
│
├── 📁 docs/
│   ├── 📄 README.md             # Full documentation
│   ├── 📄 ARCHITECTURE.md       # System design
│   ├── 📄 DATABASE.md           # Schema design
│   └── 📄 DEPLOYMENT.md         # Deployment guide
│
├── 📄 QUICK_START.md            # Quick setup guide
├── 📄 README.md                 # This file
└── 📄 .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Gmail account

### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables in .env
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# - EMAIL_USER, EMAIL_PASSWORD

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App runs on http://localhost:5173
```

### 3️⃣ Test the Application

- Open http://localhost:5173
- Register a new account
- Create your first blog post
- Share your story!

📖 **See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions**

---

## 📖 Documentation

- **[README.md](./docs/README.md)** - Complete project documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture & design patterns
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/me` - Current user

### Blogs
- `GET /api/blogs` - List all blogs
- `POST /api/blogs` - Create blog
- `GET /api/blogs/:slug` - Get blog by slug
- `PUT /api/blogs/:blogId` - Update blog
- `DELETE /api/blogs/:blogId` - Delete blog
- `POST /api/blogs/:blogId/like` - Like blog
- `POST /api/blogs/:blogId/bookmark` - Bookmark blog

### Users
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/update-profile` - Update profile
- `POST /api/users/follow/:userId` - Follow user
- `DELETE /api/users/unfollow/:userId` - Unfollow user
- `GET /api/users/dashboard` - User dashboard

### Comments
- `GET /api/blogs/:blogId/comments` - Get comments
- `POST /api/blogs/:blogId/comments` - Create comment
- `PUT /api/blogs/:blogId/comments/:commentId` - Edit comment
- `DELETE /api/blogs/:blogId/comments/:commentId` - Delete comment

---

## 🗄 Database Models

- **User** - User accounts & profiles
- **Blog** - Blog posts & content
- **Comment** - Comments & replies
- **Category** - Blog categories
- **Tag** - Blog tags
- **Bookmark** - Saved articles
- **Follower** - Follow relationships
- **Notification** - User notifications
- **ReadingHistory** - User reading history

---

## 🔐 Security Features

✅ JWT authentication with httpOnly cookies
✅ Password hashing with bcrypt
✅ CORS protection
✅ Rate limiting on API endpoints
✅ Input validation with Zod
✅ Helmet for security headers
✅ HTTPS enforcement (production)
✅ SQL injection prevention
✅ XSS protection

---

## 🚢 Deployment

### Frontend Deployment (Vercel)
```bash
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy
```

### Backend Deployment (Render/Railway)
```bash
1. Create account
2. Connect GitHub repository
3. Set environment variables
4. Deploy
```

**See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions**

---

## 🎓 Learning Resources

This project demonstrates:
- ✅ Full-stack MERN development
- ✅ RESTful API design
- ✅ MongoDB schema design
- ✅ JWT authentication
- ✅ React hooks & state management
- ✅ Form validation
- ✅ Error handling
- ✅ SEO optimization
- ✅ Production deployment
- ✅ Security best practices

Perfect for portfolio or internship evaluation!

---

## 📈 Future Enhancements

- [ ] Social OAuth (Google, GitHub)
- [ ] Real-time notifications with Socket.io
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Email newsletters
- [ ] Recommendation engine
- [ ] Mobile app (React Native)
- [ ] Dark mode support
- [ ] Video embedding
- [ ] Collaborative editing

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 💬 Support & Questions

- 📖 Check the [documentation](./docs/)
- 🐛 Open an issue for bugs
- 💡 Open a discussion for ideas
- 📧 Contact the development team

---

## 🙏 Acknowledgments

- Design inspiration from Medium, Hashnode, Ghost CMS
- UI components built with Tailwind CSS
- Icons from react-icons
- Database solutions by MongoDB
- Image hosting by Cloudinary

---

<div align="center">

**Made with ❤️ for writers and readers everywhere**

[⬆ Back to Top](#-writespace---modern-mern-blogging-platform)

</div>
#   W r i t e S p a c e  
 