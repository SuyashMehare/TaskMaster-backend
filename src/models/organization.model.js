import mongoose from 'mongoose';
import { OrganisationUser } from './organizationUser.model';

const { Schema } = mongoose;

const organizationSchema = new Schema({
  name: {
    type: String,
    unique: [true, 'Organization name must be unique'],
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true
  },

  superAdmin: {
    type: Schema.Types.ObjectId,
    ref: OrganisationUser,
    required: true
  },

  assignees: [{
    type: Schema.Types.ObjectId,
    ref: OrganisationUser
  }],

  waitingList: [{
    type: Schema.Types.ObjectId,
    ref: OrganisationUser
  }],

  teams: [{
    type: Schema.Types.ObjectId,
    ref: OrganisationUser
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

export const Organization = mongoose.model('Organization', organizationSchema);
