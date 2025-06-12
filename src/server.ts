// src/server.ts (Debug version)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Starting server setup...');

// Security middleware
app.use(helmet());
app.use(rateLimiter);

// General middleware
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('✅ Middleware configured');

// Health check
app.get('/health', (req, res) => {
  console.log('📊 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Luma Clone API is running!'
  });
});

console.log('✅ Health check route configured');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoutes);

console.log('✅ API routes configured');

// Error handling
app.use(notFound);
app.use(errorHandler);

console.log('✅ Error handling configured');

// Start server function
function startServer() {
  try {
    console.log('🚀 Starting HTTP server...');
    
    const server = app.listen(PORT, () => {
      console.log('\n🎉 Luma Clone Backend Started Successfully!');
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`📅 Events: http://localhost:${PORT}/api/events`);
      console.log('\n✨ Server is ready to accept connections!');
      
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API base URL: http://localhost:${PORT}/api`);
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      logger.error('Server error:', error);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n📴 SIGTERM received, shutting down gracefully');
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n📴 SIGINT received, shutting down gracefully');
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Add some debug logging
console.log('🔍 Environment check:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- PORT: ${PORT}`);
console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);

// Start the server
startServer();