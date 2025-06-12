# Luma Clone API Documentation

## 🚀 Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## 📋 Table of Contents
- [Authentication](#authentication)
- [Events](#events)
- [Users](#users)
- [File Upload](#file-upload)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Pagination](#pagination)

---

## 🔐 Authentication

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `email`: Valid email format, normalized
- `username`: 3-30 characters, alphanumeric + underscore only
- `firstName`: 1-50 characters
- `lastName`: 1-50 characters  
- `password`: Minimum 8 characters, must contain lowercase, uppercase, and digit

**Response (201):**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "verified": false,
    "createdAt": "2025-06-12T12:00:00.000Z"
  }
}
```

### Login User
Authenticate user and receive tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "👨‍💼",
    "verified": true
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Refresh Token
Get new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response (200):**
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

### Get Current User
Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "👨‍💼",
  "bio": "Tech enthusiast",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com",
  "verified": true,
  "createdAt": "2025-06-12T12:00:00.000Z",
  "_count": {
    "hostedEvents": 5,
    "attendances": 12,
    "followers": 25,
    "follows": 15
  }
}
```

### Logout
Invalidate refresh token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 📅 Events

### Get Events
Retrieve events with filtering, search, and pagination.

**Endpoint:** `GET /events`

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (min: 1) | `?page=2` |
| `limit` | integer | Items per page (1-50) | `?limit=20` |
| `search` | string | Search in title, description, tags | `?search=AI` |
| `category` | string | Filter by category | `?category=TECHNOLOGY` |
| `location` | string | Filter by location | `?location=San Francisco` |
| `startDate` | ISO8601 | Filter events from date | `?startDate=2025-06-20` |
| `endDate` | ISO8601 | Filter events until date | `?endDate=2025-12-31` |
| `priceMin` | number | Minimum price filter | `?priceMin=0` |
| `priceMax` | number | Maximum price filter | `?priceMax=100` |
| `featured` | boolean | Show only featured events | `?featured=true` |

**Categories:**
- `TECHNOLOGY`
- `BUSINESS`  
- `DESIGN`
- `SOCIAL`
- `NETWORKING`
- `EDUCATION`
- `HEALTH`
- `SPORTS`
- `MUSIC`
- `ART`
- `FOOD`
- `TRAVEL`
- `OTHER`

**Response (200):**
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "AI & Machine Learning Meetup",
      "description": "Join us for an evening of discussions...",
      "startDate": "2025-06-20T18:00:00.000Z",
      "endDate": "2025-06-20T21:00:00.000Z",
      "timezone": "UTC",
      "location": "Tech Hub, San Francisco",
      "address": "123 Tech Street, San Francisco, CA 94105",
      "category": "TECHNOLOGY",
      "maxAttendees": 200,
      "currentAttendees": 127,
      "price": "0.00",
      "currency": "USD",
      "coverImage": "https://example.com/image.jpg",
      "images": ["https://example.com/img1.jpg"],
      "tags": ["AI", "Machine Learning", "Networking"],
      "featured": true,
      "isPublic": true,
      "createdAt": "2025-06-12T12:00:00.000Z",
      "updatedAt": "2025-06-12T12:00:00.000Z",
      "publishedAt": "2025-06-12T12:00:00.000Z",
      "host": {
        "id": "uuid",
        "username": "sarahkim",
        "firstName": "Sarah",
        "lastName": "Kim",
        "avatar": "👩‍💼",
        "verified": true
      },
      "attendeeCount": 127,
      "likeCount": 45,
      "isLiked": false,
      "userRSVP": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Get Event by ID
Retrieve detailed information about a specific event.

**Endpoint:** `GET /events/:id`

**Path Parameters:**
- `id` (UUID): Event ID

**Headers (Optional):**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "AI & Machine Learning Meetup",
  "description": "Join us for an evening of discussions...",
  "startDate": "2025-06-20T18:00:00.000Z",
  "endDate": "2025-06-20T21:00:00.000Z",
  "timezone": "UTC",
  "location": "Tech Hub, San Francisco",
  "address": "123 Tech Street, San Francisco, CA 94105",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "category": "TECHNOLOGY",
  "subcategory": "AI/ML",
  "maxAttendees": 200,
  "currentAttendees": 127,
  "price": "0.00",
  "currency": "USD",
  "coverImage": "https://example.com/image.jpg",
  "images": ["https://example.com/img1.jpg"],
  "tags": ["AI", "Machine Learning", "Networking"],
  "featured": true,
  "isPublic": true,
  "requiresApproval": false,
  "allowWaitlist": true,
  "canceled": false,
  "createdAt": "2025-06-12T12:00:00.000Z",
  "updatedAt": "2025-06-12T12:00:00.000Z",
  "publishedAt": "2025-06-12T12:00:00.000Z",
  "host": {
    "id": "uuid",
    "username": "sarahkim",
    "firstName": "Sarah",
    "lastName": "Kim",
    "avatar": "👩‍💼",
    "verified": true,
    "bio": "Tech enthusiast and AI researcher"
  },
  "attendeeCount": 127,
  "likeCount": 45,
  "reviewCount": 12,
  "isLiked": false,
  "userRSVP": "GOING",
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Amazing event! Learned so much.",
      "createdAt": "2025-06-12T12:00:00.000Z",
      "user": {
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "👨‍💻"
      }
    }
  ]
}
```

### Get Trending Events
Retrieve trending/popular events.

**Endpoint:** `GET /events/trending`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "AI & Machine Learning Meetup",
    "description": "Join us for an evening...",
    "startDate": "2025-06-20T18:00:00.000Z",
    "location": "Tech Hub, San Francisco",
    "category": "TECHNOLOGY",
    "currentAttendees": 127,
    "price": "0.00",
    "coverImage": "https://example.com/image.jpg",
    "featured": true,
    "host": {
      "username": "sarahkim",
      "firstName": "Sarah",
      "lastName": "Kim",
      "avatar": "👩‍💼",
      "verified": true
    },
    "_count": {
      "rsvps": 127,
      "likes": 45
    }
  }
]
```

### Create Event
Create a new event (requires authentication).

**Endpoint:** `POST /events`

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "React Workshop 2025",
  "description": "Learn the latest React patterns and best practices in this hands-on workshop.",
  "startDate": "2025-07-15T10:00:00.000Z",
  "endDate": "2025-07-15T17:00:00.000Z",
  "timezone": "America/Los_Angeles",
  "location": "Tech Center, Downtown",
  "address": "456 Developer Ave, San Francisco, CA 94102",
  "latitude": 37.7849,
  "longitude": -122.4094,
  "category": "TECHNOLOGY",
  "subcategory": "Frontend Development",
  "maxAttendees": 50,
  "price": 99.99,
  "currency": "USD",
  "coverImage": "https://example.com/react-workshop.jpg",
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "tags": ["React", "JavaScript", "Workshop", "Frontend"],
  "isPublic": true,
  "requiresApproval": false,
  "allowWaitlist": true
}
```

**Validation Rules:**
- `title`: 3-100 characters
- `description`: 10-2000 characters  
- `startDate`: Valid ISO8601 date
- `endDate`: Valid ISO8601 date (optional)
- `location`: 3-200 characters
- `category`: Must be one of the valid categories
- `maxAttendees`: Positive integer (optional)
- `price`: Non-negative number (optional)
- `tags`: Array of strings (optional)

**Response (201):**
```json
{
  "id": "uuid",
  "title": "React Workshop 2025",
  "description": "Learn the latest React patterns...",
  "startDate": "2025-07-15T10:00:00.000Z",
  "endDate": "2025-07-15T17:00:00.000Z",
  "location": "Tech Center, Downtown",
  "category": "TECHNOLOGY",
  "maxAttendees": 50,
  "currentAttendees": 0,
  "price": "99.99",
  "tags": ["React", "JavaScript", "Workshop", "Frontend"],
  "isPublic": true,
  "featured": false,
  "canceled": false,
  "createdAt": "2025-06-12T12:00:00.000Z",
  "updatedAt": "2025-06-12T12:00:00.000Z",
  "publishedAt": "2025-06-12T12:00:00.000Z",
  "hostId": "uuid",
  "host": {
    "id": "uuid",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "👨‍💻",
    "verified": true
  }
}
```

### RSVP to Event
RSVP to an event (requires authentication).

**Endpoint:** `POST /events/:id/rsvp`

**Path Parameters:**
- `id` (UUID): Event ID

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "GOING"
}
```

**RSVP Status Options:**
- `GOING`: User will attend
- `MAYBE`: User might attend  
- `NOT_GOING`: User will not attend

**Response (200):**
```json
{
  "id": "uuid",
  "status": "GOING",
  "createdAt": "2025-06-12T12:00:00.000Z",
  "updatedAt": "2025-06-12T12:00:00.000Z",
  "paymentId": null,
  "paymentStatus": "PENDING",
  "amountPaid": "0.00",
  "ticketType": null,
  "userId": "uuid",
  "eventId": "uuid"
}
```

### Like/Unlike Event
Like or unlike an event (requires authentication).

**Endpoint:** `POST /events/:id/like`

**Path Parameters:**
- `id` (UUID): Event ID

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "isLiked": true
}
```

---

## 👥 Users

### Get User Profile
Get user profile by ID.

**Endpoint:** `GET /users/profile/:id`

**Path Parameters:**
- `id` (UUID): User ID

**Response (200):**
```json
{
  "message": "Get user profile {id} - to be implemented"
}
```

### Update User Profile
Update authenticated user's profile.

**Endpoint:** `PUT /users/profile`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "message": "Update user profile - to be implemented"
}
```

### Get User Events
Get events hosted by a user.

**Endpoint:** `GET /users/:id/events`

**Path Parameters:**
- `id` (UUID): User ID

**Response (200):**
```json
{
  "message": "Get user events {id} - to be implemented"
}
```

---

## 📎 File Upload

### Upload Image
Upload an image file.

**Endpoint:** `POST /upload/image`

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

**Response (200):**
```json
{
  "message": "Image upload endpoint - to be implemented"
}
```

### Upload Avatar
Upload user avatar.

**Endpoint:** `POST /upload/avatar`

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

**Response (200):**
```json
{
  "message": "Avatar upload endpoint - to be implemented"
}
```

---

## ⚠️ Error Handling

### Error Response Format
All errors follow this consistent format:

```json
{
  "error": {
    "message": "Error description",
    "stack": "Error stack trace (development only)"
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Access denied |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

### Common Error Examples

**Validation Error (400):**
```json
{
  "error": {
    "message": "Validation error: Title must be between 3 and 100 characters"
  }
}
```

**Authentication Error (401):**
```json
{
  "error": {
    "message": "Access denied. No token provided."
  }
}
```

**Not Found Error (404):**
```json
{
  "error": {
    "message": "Event not found"
  }
}
```

**Rate Limit Error (429):**
```json
{
  "error": {
    "message": "Too many requests from this IP, please try again later."
  }
}
```

---

## 🚦 Rate Limiting

**Default Limits:**
- **Window:** 15 minutes
- **Max Requests:** 100 per IP per window
- **Headers:** Rate limit info included in response headers

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1640995200
```

---

## 📄 Pagination

For endpoints that return lists (e.g., `/events`), pagination follows this format:

**Query Parameters:**
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 20, min: 1, max: 50)

**Response Format:**
```json
{
  "events": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 🔍 Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Get Events
```bash
curl http://localhost:3001/api/events
```

### Get Events with Filters
```bash
curl "http://localhost:3001/api/events?category=TECHNOLOGY&limit=5&search=AI"
```

### Get Trending Events
```bash
curl http://localhost:3001/api/events/trending
```

### Get Specific Event
```bash
curl http://localhost:3001/api/events/{event-id}
```

### RSVP to Event (with authentication)
```bash
curl -X POST http://localhost:3001/api/events/{event-id}/rsvp \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "GOING"}'
```

### Like Event (with authentication)
```bash
curl -X POST http://localhost:3001/api/events/{event-id}/like \
  -H "Authorization: Bearer {your-token}"
```

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "password": "SecurePass123!"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Event (with authentication)
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Awesome Event",
    "description": "This is a test event for API demonstration",
    "startDate": "2025-07-01T18:00:00.000Z",
    "location": "Test Venue, City",
    "category": "TECHNOLOGY",
    "price": 0,
    "tags": ["test", "api", "demo"]
  }'
```

---

## 🗄️ Database Schema

The API uses PostgreSQL with Prisma ORM. Key models include:

### **User Model**
```typescript
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  firstName String
  lastName  String
  avatar    String?
  bio       String?
  verified  Boolean  @default(false)
  
  // Relations
  hostedEvents Event[]  @relation("EventHost")
  attendances  RSVP[]
  likes        Like[]
  follows      Follow[] @relation("Follower")
  followers    Follow[] @relation("Following")
  reviews      Review[]
}
```

### **Event Model**
```typescript
model Event {
  id          String   @id @default(uuid())
  title       String
  description String
  startDate   DateTime
  endDate     DateTime?
  location    String
  category    Category
  
  // Ticket info
  maxAttendees    Int?
  currentAttendees Int     @default(0)
  price           Decimal @default(0)
  
  // Settings
  isPublic     Boolean @default(true)
  featured     Boolean @default(false)
  canceled     Boolean @default(false)
  
  // Relations
  hostId   String
  host     User   @relation("EventHost")
  rsvps    RSVP[]
  likes    Like[]
  reviews  Review[]
}
```

### **RSVP Model**
```typescript
model RSVP {
  id       String     @id @default(uuid())
  status   RSVPStatus @default(GOING)
  
  // Payment info
  paymentStatus PaymentStatus @default(PENDING)
  amountPaid    Decimal       @default(0)
  
  // Relations
  userId  String
  eventId String
  user    User   @relation()
  event   Event  @relation()
}
```

### **Enums**
```typescript
enum Category {
  TECHNOLOGY, BUSINESS, DESIGN, SOCIAL, 
  NETWORKING, EDUCATION, HEALTH, SPORTS, 
  MUSIC, ART, FOOD, TRAVEL, OTHER
}

enum RSVPStatus {
  GOING, MAYBE, NOT_GOING, WAITLIST
}

enum PaymentStatus {
  PENDING, COMPLETED, FAILED, REFUNDED
}
```

---

## 🚀 Advanced Features

### **Search Capabilities**
The API supports full-text search across:
- Event titles
- Event descriptions  
- Event tags
- Location names

**Example:**
```bash
curl "http://localhost:3001/api/events?search=machine%20learning"
```

### **Complex Filtering**
Combine multiple filters for precise results:
```bash
curl "http://localhost:3001/api/events?category=TECHNOLOGY&priceMin=0&priceMax=50&location=San%20Francisco&startDate=2025-06-01&endDate=2025-12-31"
```

### **Authentication Flow**
1. Register → Receive verification email
2. Verify email → Account activated
3. Login → Receive access + refresh tokens
4. Use access token for protected endpoints
5. Refresh token when access token expires
6. Logout → Invalidate refresh token

### **RSVP System Features**
- **Capacity Management:** Events can have maximum attendee limits
- **Waitlist Support:** Users can join waitlist when event is full
- **Status Tracking:** GOING, MAYBE, NOT_GOING statuses
- **Payment Integration:** Ready for ticket pricing and payments

### **Performance Optimizations**
- **Caching:** Frequently accessed events cached in Redis
- **Pagination:** Large result sets split into pages
- **Query Optimization:** Database queries optimized with Prisma
- **Selective Loading:** Only requested fields loaded from database

---

## 🔧 Configuration

### **Environment Variables**
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/luma_clone"

# Redis Cache
REDIS_URL="redis://localhost:6379"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Server
PORT=3001
NODE_ENV="development"

# Email Service
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Frontend Integration
FRONTEND_URL="http://localhost:3000"

# File Upload (Optional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### **Security Configuration**
- **CORS:** Configured for development and production origins
- **Helmet:** Security headers automatically applied
- **Rate Limiting:** Configurable per-IP request limits
- **Input Validation:** All endpoints validate input data
- **JWT Tokens:** Configurable expiration times
- **Password Hashing:** Bcrypt with configurable rounds

---

## 📊 Monitoring & Analytics

### **Health Check Endpoint**
```bash
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-06-12T12:00:00.000Z",
  "uptime": 3600.123,
  "message": "Luma Clone API is running!"
}
```

### **Logging**
The API uses structured logging with Winston:
- **Info logs:** General application events
- **Error logs:** Application errors and exceptions
- **Access logs:** HTTP request/response logging
- **Performance logs:** Database query performance

**Log Files:**
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

### **Metrics Available**
- Request/response times
- Database query performance
- Cache hit/miss rates
- Authentication success/failure rates
- Event creation and engagement rates

---

## 🚀 Deployment Guide

### **Production Checklist**

#### **Security**
- [ ] Generate secure JWT secrets
- [ ] Configure HTTPS/TLS certificates
- [ ] Set up firewall rules
- [ ] Enable security headers
- [ ] Configure CORS for production domains
- [ ] Set up rate limiting
- [ ] Enable audit logging

#### **Database**
- [ ] Set up production PostgreSQL instance
- [ ] Configure connection pooling
- [ ] Set up database backups
- [ ] Configure read replicas (if needed)
- [ ] Run database migrations
- [ ] Set up monitoring

#### **Cache & Performance**
- [ ] Set up production Redis instance
- [ ] Configure Redis clustering (if needed)
- [ ] Enable response compression
- [ ] Set up CDN for static assets
- [ ] Configure load balancing

#### **Monitoring**
- [ ] Set up application monitoring
- [ ] Configure log aggregation
- [ ] Set up alerting
- [ ] Monitor database performance
- [ ] Track API metrics

### **Docker Production Deployment**
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
COPY . .
RUN npx prisma generate && npm run build

FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
USER nodejs
EXPOSE 3001
CMD ["npm", "start"]
```

### **Kubernetes Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: luma-clone-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: luma-clone-api
  template:
    metadata:
      labels:
        app: luma-clone-api
    spec:
      containers:
      - name: api
        image: luma-clone-api:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-url
```

---

## 🧪 Testing

### **Manual Testing with cURL**
Test the complete flow:

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Register new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User", 
    "password": "SecurePass123!"
  }'

# 3. Login (save the token)
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' | jq -r '.accessToken')

# 4. Get current user
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 5. Get events
curl http://localhost:3001/api/events

# 6. Create an event
EVENT_ID=$(curl -X POST http://localhost:3001/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event",
    "startDate": "2025-07-01T18:00:00.000Z",
    "location": "Test Location",
    "category": "TECHNOLOGY"
  }' | jq -r '.id')

# 7. RSVP to the event
curl -X POST http://localhost:3001/api/events/$EVENT_ID/rsvp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "GOING"}'

# 8. Like the event
curl -X POST http://localhost:3001/api/events/$EVENT_ID/like \
  -H "Authorization: Bearer $TOKEN"
```

### **Automated Testing Setup**
```bash
# Install testing dependencies
npm install --save-dev jest supertest @types/jest @types/supertest

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## 🤝 Integration Examples

### **Frontend Integration (React)**
```javascript
// API client setup
const API_BASE_URL = 'http://localhost:3001/api';

class LumaAPI {
  constructor() {
    this.token = localStorage.getItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.accessToken;
    localStorage.setItem('accessToken', this.token);
    return response;
  }

  // Events
  async getEvents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/events?${params}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async rsvpToEvent(eventId, status) {
    return this.request(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }
}

// Usage example
const api = new LumaAPI();

// Login and get events
api.login('user@example.com', 'password')
  .then(() => api.getEvents({ category: 'TECHNOLOGY' }))
  .then(data => console.log('Events:', data.events));
```

### **Mobile Integration (React Native)**
```javascript
// Similar to frontend integration but with AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

class LumaMobileAPI {
  constructor() {
    this.token = null;
    this.loadToken();
  }

  async loadToken() {
    this.token = await AsyncStorage.getItem('accessToken');
  }

  async saveToken(token) {
    this.token = token;
    await AsyncStorage.setItem('accessToken', token);
  }

  // Rest of the implementation similar to web version
}
```

---

## 📝 FAQ

### **Q: How do I reset the database?**
```bash
npm run db:reset
npm run seed
```

### **Q: How do I add a new event category?**
Update the `Category` enum in `prisma/schema.prisma` and run:
```bash
npm run db:push
```

### **Q: How do I enable email verification?**
Set up email configuration in `.env`:
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### **Q: How do I handle file uploads?**
The upload endpoints are placeholders. Implement using:
- **Multer** for handling multipart/form-data
- **Cloudinary** or **AWS S3** for file storage
- **Sharp** for image processing

### **Q: How do I add real-time features?**
Integrate Socket.io for real-time updates:
```bash
npm install socket.io
```

### **Q: How do I add payment processing?**
Integrate payment providers like:
- **Stripe** for credit card processing
- **PayPal** for alternative payments
- **Webhook handlers** for payment confirmations

---

## 🔗 Related Resources

- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM
- **[Express.js Guide](https://expressjs.com/)** - Web framework
- **[JWT.io](https://jwt.io/)** - JSON Web Tokens
- **[Redis Documentation](https://redis.io/documentation)** - Caching
- **[Docker Documentation](https://docs.docker.com/)** - Containerization
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type safety

---

**Happy coding! 🎉**

For support or questions, please refer to the project repository or contact the development team.