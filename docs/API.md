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

---

## 🗄️ Database Schema

The API uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts and profiles
- **Event**: Event information and settings
- **RSVP**: Event attendance tracking
- **Like**: Event likes/favorites
- **Follow**: User follow relationships
- **Review**: Event reviews and ratings

---

## 🚀 Deployment

### Environment Variables
Ensure these are set in production:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"
JWT_SECRET="your-production-secret"
JWT_REFRESH_SECRET="your-production-refresh-secret"
NODE_ENV="production"
EMAIL_HOST="smtp.service.com"
EMAIL_USER="noreply@yourdomain.com"
EMAIL_PASS="your-email-password"
FRONTEND_URL="https://yourdomain.com"
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t luma-clone-api .
docker run -p 3001:3001 luma-clone-api
```

---

## 📝 Notes

- **Authentication:** JWT tokens expire in 15 minutes (configurable)
- **Refresh Tokens:** Valid for 7 days (configurable)
- **File Uploads:** Currently placeholder endpoints
- **Email Verification:** Required for new accounts
- **Password Reset:** Available via email
- **Caching:** Redis used for performance optimization
- **Logging:** Comprehensive logging with Winston
- **Security:** Helmet.js, CORS, rate limiting enabled

---

## 🤝 Support

For questions or issues:
1. Check the logs: `docker-compose logs api`
2. Health check: `GET /health`
3. Review error responses for debugging information

**Happy coding! 🎉**