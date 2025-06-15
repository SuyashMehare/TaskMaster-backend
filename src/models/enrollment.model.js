import mongoose, { Schema } from "mongoose";
import { Organization } from "./organization.model.js"; 
import { OrganisationUser } from "./organizationUser.model.js";

const enrollmentSchema = new Schema({
    enrollmentId: {
        type:String,
        required: true,
        unique: true,
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: Organization, 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: OrganisationUser, 
        required: true
    },
    isAvailed: {
        type: Boolean,
        default: false
    },
    expireIn: {
        type: Date,
    }
}, {
    timestamps: true
});


export const Enrollement = mongoose.model('Enrollment', enrollmentSchema);