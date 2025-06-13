import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    min: [2, 'Username must be at least 3 characters long'],
    max: [30, 'Username must be at most 30 characters long'],
    required: [true, 'Username is required'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },

  timezone: {
    type: String,
    default: 'UTC',
    required: [true, 'Timezone is required']
  },

  activeOrganizations: [{
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  }],

  clientOrganizations: [{
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  }],

  ownedOrganizations: [{
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  }],
  
  block: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
