import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import Post from './models/Post.js';
import { seedDatabase } from './utils/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Core Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Blogging Platform REST API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server and connect DB
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('📦 Empty database detected, auto-seeding with starter posts and users...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Blog API Server running on http://localhost:${PORT}`);
      console.log(`📚 Health check available at http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
