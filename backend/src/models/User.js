/**
 * User.js - User Mongoose Model
 * Stores authentication credentials and user profile data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Full display name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },

  // Unique email address used as login identifier
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },

  // Hashed password — excluded from queries by default (select: false)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },

  // Optional avatar/profile picture URL
  avatar: {
    type: String,
    default: '',
  },

  // Subscription plan tier
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },

  // Cumulative count of AI analyses performed by this user
  totalAnalyses: {
    type: Number,
    default: 0,
  },

  // Array of bookmarked Analysis document IDs
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
    },
  ],

  // Account creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Pre-save Hook: Hash Password ─────────────────────────────────────────────
// Only hash the password when it has been modified (or is new)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Instance Method: Compare Passwords ───────────────────────────────────────
/**
 * Compare a plain-text candidate password against the stored hash.
 * @param {string} candidatePassword - The password provided at login
 * @returns {Promise<boolean>} true if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── toJSON Transform: Remove Sensitive Fields ─────────────────────────────────
// Strip the password hash whenever a user document is serialized to JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
