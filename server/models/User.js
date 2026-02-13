import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Store resume history
  resumes: [{
    fileName: String,
    date: { type: Date, default: Date.now },
    score: Number,
    totalChecksPassed: Number,
    wordCount: Number,
    matchScore: Number,
    skills: [String],
    missingSkills: [String]
  }],
  // Store stats
  stats: {
    skillsCount: { type: Number, default: 0 },
    matchesCount: { type: Number, default: 0 }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
