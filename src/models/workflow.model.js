import mongoose, { Schema } from "mongoose";
import { Product } from "../models/product.model.js";

const v0State = ['START', 'INPROGRESS', 'COMPLETED'];


const stateAndCasesSchema = new Schema({
  state: {
    type: String,
    enum: v0State,
    required: true
  },
  case: {
    pass: {
      type: Number,
      required: true,
      min: 0
    },
    fail: {
      type: Number,
      required: true,
      min: 0
    }
  }
});


const workflowSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
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
  statesAndCases: [stateAndCasesSchema],
}, {
  timestamps: true
});

// Indexes
workflowSchema.index({ productId: 1 });
workflowSchema.index({ name: 1 });

// Validation to ensure exactly one initial state
workflowSchema.pre('save', function(next) {
  const initialStates = this.states.filter(s => s.isInitial);
  if (initialStates.length !== 1) {
    throw new Error('Workflow must have exactly one initial state');
  }
  next();
});

export const Workflow = mongoose.model('Workflow', workflowSchema);