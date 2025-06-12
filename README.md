# Luma Clone Backend

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7+-red.svg)](https://redis.io)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748.svg)](https://prisma.io)

A production-ready event management API built with modern technologies. This is the backend service for a Luma.com clone, featuring comprehensive event management, user authentication, and real-time capabilities.

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Email verification and password reset
- Rate limiting and DDoS protection
- Input validation and sanitization
- Secure password hashing with bcrypt

### 📅 **Event Management**
- Create, read, update, delete events
- Advanced filtering (category, location, price, date range)
- Full-text search across titles, descriptions, and tags
- RSVP system with status tracking (Going/Maybe/Not Going)
- Event capacity management and waitlists
- Like/unlike functionality
- Featured events and trending algorithm

### 👥 **User Features**
- User profiles with avatars and bio
- Follow/follower relationships
- Event hosting capabilities
- Attendance history tracking
- User verification system

### ⚡ **Performance & Scalability**
- Redis caching for frequently accessed data
- Database query optimization with Prisma
- Pagination for large datasets
- Structured logging with Winston
- Health check monitoring
- Graceful shutdown handling

### 🛡️ **Production Ready**
- Docker containerization
- Environment-based configuration
- Comprehensive error handling
- API rate limiting
- CORS configuration
- Security headers with Helmet.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd lomba-backend
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
DATABASE_URL="postgresql://postgres:password@localhost:5432/luma_clone"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
# ... other settings
```

### 3. Start Databases
```bash
# Start PostgreSQL and Redis with Docker
docker-compose up db redis -d

# Wait for databases to be ready
docker-compose logs db | grep "ready to accept connections"
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run seed
```

### 5. Start Development Server
```bash
# Start the API server
npm run dev

# Server will start on http://localhost:3001
# Health check: http://localhost:3001/health
```

## 📚 Documentation

| Resource | Description | Link |
|----------|-------------|------|
| **Complete API Guide** | Comprehensive API documentation with examples | [docs/README.md](docs/README.md) |
| **Interactive API Docs** | Swagger UI for testing endpoints | `http://localhost:3001/api-docs` |
| **Health Check** | Server status and uptime | `http://localhost:3001/health` |

## 🏗️ Architecture

### **Tech Stack**
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js with middleware ecosystem
- **Database:** PostgreSQL 15 with Prisma ORM
- **Cache:** Redis for performance optimization
- **Authentication:** JWT tokens with refresh mechanism
- **Validation:** express-validator with custom middleware
- **Logging:** Winston with structured logging
- **Testing:** Jest with Supertest (ready for implementation)

### **Project Structure**
```
src/
├── config/           # Database and Redis configuration
├── controllers/      # Business logic and request handlers
├── middleware/       # Authentication, validation, error handling
├── routes/           # API route definitions
├── utils/            # Helper functions and utilities
├── swagger/          # API documentation setup
└── server.ts         # Main application entry point

prisma/
├── schema.prisma     # Database schema definition
└── seed.ts          # Database seeding script

docs/
└── README.md        # Complete API documentation
```

### **Database Schema**
- **Users:** Authentication, profiles, relationships
- **Events:** Event information, settings, media
- **RSVPs:** Attendance tracking with payment support
- **Likes:** Event favorites and engagement
- **Reviews:** Event ratings and feedback
- **Follows:** User social connections

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio (database GUI)
npm run seed         # Seed database with sample data

# Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

## 🌐 API Endpoints

### **Core Endpoints**
```bash
# Health & Status
GET  /health                 # Server health check

# Authentication  
POST /api/auth/register      # User registration
POST /api/auth/login         # User login
POST /api/auth/refresh       # Refresh access token
GET  /api/auth/me           # Get current user
POST /api/auth/logout       # User logout

# Events
GET  /api/events            # List events (with filtering)
GET  /api/events/trending   # Get trending events
GET  /api/events/:id        # Get event details
POST /api/events            # Create event (auth required)
POST /api/events/:id/rsvp   # RSVP to event (auth required)
POST /api/events/:id/like   # Like event (auth required)

# Users
GET  /api/users/profile/:id # Get user profile
PUT  /api/users/profile     # Update profile (auth required)
GET  /api/users/:id/events  # Get user's events
```

### **Quick Test**
```bash
# Health check
curl http://localhost:3001/health

# Get events
curl http://localhost:3001/api/events

# Get events with filters
curl "http://localhost:3001/api/events?category=TECHNOLOGY&limit=5"
```

## 🐳 Docker Deployment

### **Development with Docker**
```bash
# Start all services
docker-compose up

# Start only databases
docker-compose up db redis -d

# View logs
docker-compose logs -f api
```

### **Production Deployment**
```bash
# Build production image
docker build -t luma-clone-api .

# Run with production settings
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=your-production-db-url \
  luma-clone-api
```

## 🔒 Security Features

- **JWT Authentication** with access/refresh token pattern
- **Rate Limiting** (100 requests per 15 minutes per IP)
- **Input Validation** on all endpoints with express-validator
- **SQL Injection Protection** via Prisma ORM
- **XSS Protection** with Helmet.js security headers
- **CORS Configuration** for cross-origin resource sharing
- **Password Security** with bcrypt hashing (configurable rounds)
- **Environment Variables** for sensitive configuration

## ⚡ Performance Optimizations

- **Redis Caching** for frequently accessed events and user data
- **Database Indexing** on commonly queried fields
- **Query Optimization** with Prisma selective field loading
- **Pagination** for large result sets
- **Connection Pooling** for database efficiency
- **Compression** middleware for response optimization
- **Structured Logging** for performance monitoring

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run specific test file
npm test -- eventController.test.ts
```

## 📊 Monitoring & Debugging

### **Health Monitoring**
```bash
# Check server health
curl http://localhost:3001/health

# Check database connection
node test-connection.js

# View application logs
tail -f logs/combined.log

# View error logs only
tail -f logs/error.log
```

### **Database Management**
```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Reset database (caution: deletes all data)
npm run db:reset

# View database schema
npx prisma db pull
```

## 🚀 Deployment Checklist

### **Environment Configuration**
- [ ] Set production `DATABASE_URL`
- [ ] Configure `REDIS_URL` for production
- [ ] Generate secure `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Set up email service credentials
- [ ] Configure `FRONTEND_URL` for CORS
- [ ] Set `NODE_ENV=production`

### **Security**
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Enable log aggregation
- [ ] Configure backup strategy
- [ ] Set up SSL certificates

### **Performance**
- [ ] Configure Redis clustering (if needed)
- [ ] Set up database read replicas
- [ ] Enable CDN for static assets
- [ ] Configure load balancing
- [ ] Set up caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Add tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### **Getting Help**
- **Documentation:** [Complete API Guide](docs/README.md)
- **Issues:** Open a GitHub issue for bugs or feature requests
- **Discussions:** Use GitHub Discussions for questions

### **Troubleshooting**
```bash
# Check server status
curl http://localhost:3001/health

# View recent logs
docker-compose logs --tail=50 api

# Reset development environment
npm run db:reset && npm run seed
```

## 🎯 Roadmap

### **Current Version (v1.0)**
- ✅ Core event management
- ✅ User authentication
- ✅ RSVP and likes system
- ✅ Basic search and filtering

### **Upcoming Features**
- 🔄 Real-time notifications
- 🔄 Payment integration
- 🔄 Advanced analytics
- 🔄 Email marketing automation
- 🔄 Mobile app API extensions

---

**Built with ❤️ using modern technologies for scalable event management.**