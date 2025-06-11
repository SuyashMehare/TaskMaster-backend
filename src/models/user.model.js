import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
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

  block: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
