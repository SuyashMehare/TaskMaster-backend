import mongoose from 'mongoose';

const { Schema } = mongoose;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  superAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  assignees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }],

  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'], // You can also reference a `PlatformPlan` model instead
    default: 'free'
  },

  planValidity: {
    type: Date, // Always stored as UTC in MongoDB
    required: true
  }, // todo: maybe company timezone based validity along with UTC for correctness
}, {
  timestamps: true
});

export default mongoose.model('Organization', organizationSchema);
