const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Stores user account information including authentication and investment profile
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
    },
    preferredLanguage: {
      type: String,
      default: 'English',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    interests: {
      type: [String],
      default: [],
    },
    goals: [
      {
        title: String,
        targetAmount: Number,
        currentAmount: Number,
        deadline: Date,
        category: String,
      },
    ],
    notifications: [
      {
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, default: 'general' },
        link: { type: String, default: '' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      }
    ],
    voiceSearch: {
      type: Boolean,
      default: false,
    },
    aiAssistant: {
      type: Boolean,
      default: false,
    },
    riskProfile: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Aggressive'],
      default: 'Moderate',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
