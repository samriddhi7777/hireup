import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import resumeRoutes from './routes/resumeRoutes.js';
import { protect } from './middleware/authMiddleware.js';  // ✅ ADD THIS LINE

const app = express();
const PORT = 8000;
const JWT_SECRET = 'hireup-super-secret-key-2026';

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://hireup:dmTiZVAF8ZmmTW39@cluster0.urs8evq.mongodb.net/hireup?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
});

// ============================================
// DASHBOARD STATS API
// ============================================
app.get('/api/dashboard/stats', protect, async (req, res) => {
  try {
    // Get user's resume history from database
    const user = await User.findById(req.user.id);
    
    // Format resume history for charts
    const resumeHistory = (user.resumes || []).map(resume => ({
      date: resume.date ? resume.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      score: resume.score || 0,
      checks: resume.totalChecksPassed || 0,
      wordCount: resume.wordCount || 0,
      matchScore: resume.matchScore || 0,
      fileName: resume.fileName || 'Unknown'
    }));

    // Calculate stats
    const scores = resumeHistory.map(r => r.score);
    const stats = {
      totalScans: resumeHistory.length,
      averageScore: scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      improvementRate: scores.length > 1 
        ? Math.round(((scores[scores.length - 1] - scores[0]) / scores[0]) * 100) 
        : 0,
      skillsCount: user.stats?.skillsCount || 0,
      matchesCount: user.stats?.matchesCount || 0
    };

    res.json({
      success: true,
      data: {
        history: resumeHistory,
        stats: stats
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RESUME ROUTES
// ============================================
app.use('/api/resume', resumeRoutes);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`🚀  Hireup Backend Server Running`);
  console.log(`🚀 ========================================`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`========================================\n`);
});
