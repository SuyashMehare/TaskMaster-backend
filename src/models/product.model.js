import mongoose, { Schema } from "mongoose";
import { Organization } from "../models/organization.model.js";
import { OrganisationUser } from "../models/organizationUser.model.js";
import { Story } from "../models/story.model.js";

const ALLOWED_ROLES = ['owner', 'admin'];

const productSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: Organization,
        required: true
    },
    handleBy: {
        type: Schema.Types.ObjectId,
        ref: OrganisationUser, // Reference to OrganisationUser model
        required: true
    },
    authRole: {
        type: String,
        enum: ALLOWED_ROLES, // Restrict to 'owner' or 'admin'
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    expectedOutcome: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true,
        unique: true
    },
    epics: [{
        type: Schema.Types.ObjectId,
        ref: 'Epic'
    }],
    stories: [{
        type: Schema.Types.ObjectId,
        ref: Story
    }],
    startDate: {
        type: Date,
        required: true
    },
    sprint: {
        type: Number,
        default: 1,  // Starts from Sprint 1
        min: 1,
        validate: {
            validator: function (sprint) {
                return sprint >= 1;
            },
            message: 'Sprint number must be at least 1'
        }
    },
    sprintDuration: { 
        type: Number,
        required: true,
        min: 1,
        default: 2
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (endDate) {
                // Ensure endDate is after startDate
                return endDate > this.startDate;
            },
            message: 'End date must be after start date'
        }
    }
}, {
    timestamps: true
});

// LP_todo: Convert _id to id in API responses 
// productSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: function(doc, ret) {
//     ret.id = ret._id;
//     delete ret._id;
//   }
// });

// Add indexes for better query performance
productSchema.index(
    { organisationId: 1, name: 1 },
    { unique: true, message: 'Project name must be unique within an organization' }
);
productSchema.index({ generalAdmin: 1 });
productSchema.index({ name: 1 });
productSchema.index({ label: 1 });

export const Product = mongoose.model('Product', productSchema);