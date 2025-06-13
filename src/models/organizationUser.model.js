import mongoose from 'mongoose';
import { PLATFORM_ROLES, ROLE_TYPES, ORG_USER_ENROLLMENTS } from '../constants/roles.js';

const { Schema } = mongoose;

const organisationUserSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    roleType: {
        type: String,
        enum: ROLE_TYPES,
        default: 'member'
    },

    role: {
        type: String,
        enum: PLATFORM_ROLES,
        default: ''
    },

    enrollment: {
        type: String,
        enum: ORG_USER_ENROLLMENTS,
        default: 'invited'
    },

    createdOn: {
        type: Date,
        default: new Date()
    }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate org-user combinations
organisationUserSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const OrganisationUser = mongoose.model('OrganisationUser', organisationUserSchema);
