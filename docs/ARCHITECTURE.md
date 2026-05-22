# WriteSpace Architecture Guide

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (React)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UI Components (BlogCard, Header, etc.)            │   │
│  │  Zustand State Management                          │   │
│  │  React Router (SPA Routing)                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ (Axios HTTP)
┌─────────────────────────────────────────────────────────────┐
│                  API GATEWAY (Express)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes (Express Router)                            │   │
│  │  Middleware (Auth, Validation, Error)              │   │
│  │  Controllers (Business Logic)                       │   │
│  │  Services (Database & External Services)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 DATA ACCESS LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Mongoose Models & Schemas                          │   │
│  │  Database Connection Pool                           │   │
│  │  Indexes & Query Optimization                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                        │
│  Collections: Users, Blogs, Comments, Categories, etc.     │
└─────────────────────────────────────────────────────────────┘

External Services:
├─ Cloudinary (Image CDN)
├─ Gmail SMTP (Email)
└─ MongoDB Atlas (Managed Database)
```

## Authentication Flow

```
1. User Registration/Login
   └─> Credentials validated
   └─> Password hashed with bcrypt
   └─> JWT generated with user ID
   └─> HttpOnly cookie set
   └─> Token also sent to client

2. Protected Routes
   └─> Token sent with each request
   └─> Middleware verifies JWT
   └─> User data attached to request
   └─> Route handler executes

3. Token Refresh
   └─> Access token expires after 7 days
   └─> Refresh token (30 days) used to get new access token
   └─> Automatic refresh via axios interceptor
   └─> User session maintained
```

## Request/Response Lifecycle

```
Client Request
    ↓
Axios Interceptor (Add Token)
    ↓
Express Middleware Chain
    ├─ CORS Check
    ├─ Body Parser
    ├─ Morgan Logging
    ├─ Rate Limiter
    ├─ Authentication Check (if needed)
    ├─ Authorization Check (if needed)
    └─ Route Handler
    ↓
Controller
    ├─ Validate Input (Zod)
    ├─ Check Permissions
    ├─ Query Database
    ├─ Process Data
    └─ Send Response
    ↓
Error Handler (if error)
    ├─ Format Error
    ├─ Log Error
    └─ Send Error Response
    ↓
Client Response
```

## Component Architecture (Frontend)

### Pages
- **Home**: Hero, trending, latest blogs
- **Explore**: All blogs with filters
- **BlogDetail**: Full blog view with comments
- **CreateBlog**: Blog editor
- **Profile**: User profile & their blogs
- **Dashboard**: User stats & management

### Components
- **Layout**: Header, Sidebar, Footer
- **BlogCard**: Blog preview card
- **FilterPanel**: Category/tag filters
- **SkeletonLoader**: Loading states
- **Auth**: Login, Register forms

### Services Layer
- **api.js**: Axios instance with interceptors
- **services.js**: API call wrappers

### State Management (Zustand)
- **authStore**: User, token, authentication
- **blogStore**: Blogs, current blog, pagination
- **userStore**: User profile, followers
- **uiStore**: Theme, sidebar, notifications

## Backend Controller Pattern

```javascript
// Example: Blog Controller

export const createBlog = catchAsync(async (req, res) => {
  // 1. Validate input
  const validatedData = createBlogSchema.parse(req.body);
  
  // 2. Check permissions
  if (req.user.role !== 'author' && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }
  
  // 3. Process business logic
  const blog = await Blog.create({
    ...validatedData,
    author: req.user._id,
  });
  
  // 4. Populate relations
  await blog.populate('author category tags');
  
  // 5. Send response
  res.status(201).json({
    success: true,
    data: blog,
  });
});
```

## Middleware Chain

### 1. **Pre-request Middleware**
- CORS (Cross-Origin Resource Sharing)
- Body Parser (JSON/URL-encoded)
- Cookie Parser (HTTP-only cookies)
- Helmet (Security headers)
- Morgan (Request logging)

### 2. **Route Middleware**
- Rate Limiter (Prevent abuse)
- Authentication (Verify JWT)
- Authorization (Check role)
- Validation (Zod schemas)

### 3. **Post-request Middleware**
- Error Handler (Centralized errors)
- 404 Handler (Route not found)

## Database Indexing Strategy

```javascript
// User model
userSchema.index({ email: 1 });        // Fast email lookup
userSchema.index({ username: 1 });     // Fast username lookup
userSchema.index({ createdAt: -1 });   // Fast sorting

// Blog model
blogSchema.index({ slug: 1 });         // Fast blog retrieval
blogSchema.index({ author: 1 });       // Fast author blogs
blogSchema.index({ status: 1 });       // Fast published filter
blogSchema.index({ publishedAt: -1 }); // Sorting
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' }); // Full-text search

// Comment model
commentSchema.index({ blog: 1, createdAt: -1 }); // Blog comments
```

## Error Handling

```javascript
try {
  // 1. Custom Error
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }
  
  // 2. Validation Error (Zod)
  const data = schema.parse(req.body);
  
  // 3. MongoDB Error
  // Duplicate key error, validation error, cast error
  
  // 4. Authentication Error
  // Invalid token, expired token
  
  // 5. Server Error (500)
  // Unexpected error
} catch (error) {
  // Error middleware handles and formats
  // Logs error in production
  // Sends appropriate status code
  // Returns error message to client
}
```

## Security Measures

### Authentication & Authorization
- ✓ JWT with httpOnly cookies
- ✓ Password hashing (bcrypt)
- ✓ Password reset tokens
- ✓ Email verification
- ✓ Role-based access control

### Input Validation
- ✓ Zod schema validation
- ✓ Sanitization of user input
- ✓ Type checking on all inputs
- ✓ File upload validation

### API Security
- ✓ CORS with whitelisted origins
- ✓ Rate limiting
- ✓ Helmet security headers
- ✓ HTTPS enforcement (production)
- ✓ No sensitive data in logs

### Data Protection
- ✓ Password never sent in responses
- ✓ Sensitive fields excluded from queries
- ✓ Proper database indexing
- ✓ Connection pool management

## Performance Optimizations

### Database
- ✓ Indexes on frequently searched fields
- ✓ Connection pooling
- ✓ Query optimization
- ✓ Pagination for large results

### API
- ✓ Response compression (gzip)
- ✓ Caching headers
- ✓ Lazy loading
- ✓ Field selection in queries

### Frontend
- ✓ Code splitting
- ✓ Lazy loading components
- ✓ Image optimization
- ✓ Minified production builds
- ✓ Skeleton loaders

## Deployment Architecture

```
Production Environment:

┌─────────────────────────────────────────────┐
│         CDN (Cloudflare/Vercel)             │
│  - Static assets caching                    │
│  - Global distribution                      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Frontend (Vercel)                      │
│  - React SPA                                │
│  - Automatic deployments                    │
│  - Environment variables                    │
└─────────────────────────────────────────────┘
                    ↓ (API calls)
┌─────────────────────────────────────────────┐
│      Backend (Render/Railway)               │
│  - Express server                           │
│  - Auto-scaling                             │
│  - Environment variables                    │
└─────────────────────────────────────────────┘
                    ↓ (Database)
┌─────────────────────────────────────────────┐
│    MongoDB Atlas (Cloud)                    │
│  - Managed database                         │
│  - Automatic backups                        │
│  - IP whitelisting                          │
└─────────────────────────────────────────────┘

External Services:
├─ Cloudinary (Image hosting)
├─ Gmail (Email service)
└─ GitHub (Version control)
```

## Scalability Considerations

### Database
- Implement Redis caching layer
- Database replication
- Sharding for massive datasets
- Query optimization

### API
- Horizontal scaling with load balancer
- API rate limiting per user
- Request queuing for heavy operations
- Caching strategies

### Frontend
- Service Workers for offline support
- Progressive Web App (PWA) features
- Lazy loading all components
- Image optimization

## Monitoring & Logging

### Backend
- Morgan HTTP request logging
- Error logging with stack traces
- User action logging
- Database query logging

### Frontend
- Error boundary catches crashes
- Console error tracking
- User analytics
- Performance monitoring

### Production
- APM tools (Application Performance Monitoring)
- Error tracking (Sentry)
- Log aggregation (ELK stack)
- Uptime monitoring

## Development Workflow

```
1. Feature Branch
   └─> Create branch from main
   └─> Develop feature
   └─> Write tests
   └─> Create pull request

2. Code Review
   └─> Review changes
   └─> Run tests
   └─> Check code quality
   └─> Approve or request changes

3. Testing
   └─> Unit tests
   └─> Integration tests
   └─> E2E tests

4. Deployment
   └─> Staging environment
   └─> Manual testing
   └─> Production deployment
   └─> Monitoring
```

---

This architecture ensures scalability, security, and maintainability while providing excellent developer experience.
