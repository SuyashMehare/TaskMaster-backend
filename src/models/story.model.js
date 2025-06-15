import mongoose, { Schema } from "mongoose";
import { Epic } from "../models/epic.model.js";
import { Team } from "../models/team.model.js";
import { Workflow } from "../models/workflow.model.js";
// Define enums for StoryType, State, and IntervalType
const StoryType = ['feature', 'bug', 'chore', 'spike'];
const State = ['backlog', 'todo', 'in_progress', 'review', 'done', 'blocked'];
const IntervalType = ['daily', 'weekly', 'monthly', 'quarterly', 'none'];

const storySchema = new Schema({
  epicId: {
    type: Schema.Types.ObjectId,
    ref: Epic,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: StoryType,
    default: 'feature',
    required: true
  },
  state: {
    type: String,
    enum: State,
    default: 'backlog',
    required: true
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: Team,
    required: true
  },
  workflow: {
    type: Schema.Types.ObjectId,
    ref: Workflow,
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  interval: {
    type: String,
    enum: IntervalType,
    default: 'none',
    required: function() { return this.isRecurring; } // Required only if isRecurring=true
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date >= new Date(); // Start date shouldn't be in the past
      },
      message: 'Start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return date > this.startDate; // End date must be after start date
      },
      message: 'End date must be after start date'
    }
  }
}, {
  timestamps: true,
});

// Indexes for performance
storySchema.index({ epicId: 1 });
storySchema.index({ team: 1 });
storySchema.index({ state: 1 });
storySchema.index({ startDate: 1 });
storySchema.index({ endDate: 1 });

export const Story = mongoose.model('Story', storySchema);