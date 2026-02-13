import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'hireup-super-secret-key-2026';

// ============================================
// @desc    Register a new user
// ============================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
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
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Login user
// ============================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
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
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Get current user profile
// ============================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Update user profile
// ============================================
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Add resume to history
// ============================================
export const addResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.resumes.push({
      ...req.body,
      date: new Date()
    });
    
    await user.save();

    res.json({
      success: true,
      resume: user.resumes[user.resumes.length - 1]
    });
  } catch (error) {
    console.error('Add resume error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Get resume history
// ============================================
export const getResumes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      resumes: user.resumes.sort((a, b) => b.date - a.date)
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Delete resume from history
// ============================================
export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.resumes = user.resumes.filter(
      resume => resume.id.toString() !== req.params.id
    );
    
    await user.save();

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Save job
// ============================================
export const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.savedJobs.push({
      ...req.body,
      savedAt: new Date()
    });
    
    await user.save();

    res.json({
      success: true,
      job: user.savedJobs[user.savedJobs.length - 1]
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Update job status
// ============================================
export const updateJobStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const job = user.savedJobs.id(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    job.status = req.body.status;
    await user.save();

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// @desc    Connect GitHub
// ============================================
export const connectGitHub = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findById(req.user.id);
    
    user.github = {
      username,
      connectedAt: new Date()
    };
    
    await user.save();

    res.json({
      success: true,
      github: user.github
    });
  } catch (error) {
    console.error('GitHub connect error:', error);
    res.status(500).json({ error: error.message });
  }
};
