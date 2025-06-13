import { Schema } from "mongoose";
import { Organization } from "./organization.model.js"; 
import { OrganisationUser } from "./organizationUser.model";

const enrollmentSchema = new Schema({
    enrollmentId: {
        type:String,
        required: true,
        unique: true,
    },
    organisationId: {
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
        required: true
    }
}, {
    timestamps: true
});


export const Enrollement = mongoose.model('Enrollment', enrollmentSchema);