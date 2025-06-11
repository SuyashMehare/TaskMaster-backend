import mongoose from 'mongoose';
import { DEPARTMENTS } from '../constants/department.js';

const { Schema } = mongoose;

const teamSchema = new Schema({
  organisationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },

  department: {
    type: String,
    enum: DEPARTMENTS,
    required: true
  },

  label: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Unique team label within an organization
teamSchema.index({ organisationId: 1, label: 1 }, { unique: true });

export default mongoose.model('Team', teamSchema);
