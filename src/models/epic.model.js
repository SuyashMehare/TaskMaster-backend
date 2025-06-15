import mongoose, { Schema } from "mongoose";
import { Organization } from "../models/organization.model.js";
import { Product } from "../models/product.model.js";
import { Story } from "../models/story.model.js";

const epicSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: Organization,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  stories: [{
    type: Schema.Types.ObjectId,
    ref: 'Story'
  }]
}, {
  timestamps: true,
});

epicSchema.index(
  { productId: 1, name: 1, label: 1 },
  { unique: true, message: 'Epic and label name must be unique within a product' }
);

export const Epic = mongoose.model('Epic', epicSchema);