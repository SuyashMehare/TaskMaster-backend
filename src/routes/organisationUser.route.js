import { Router } from "express";
import {
    createUserEnrollmentTicket,
    enrollOrganizationViaEnrollmentTicket,
    loginOrganizationAdmin,
    loginOrganizationMember,
    loginOrganizationOwner,
    loginUserByLoginOne
} from "../controllers/index.js";
const organizationUserRouter = Router();

organizationUserRouter
    .post('/login/owner', loginOrganizationOwner)
    .post('/login/admin', loginOrganizationAdmin)
    .post('/login/member', loginOrganizationMember)
    .post('/login/loginOne', loginUserByLoginOne)

organizationUserRouter
    .post('/enrollmentTicket', createUserEnrollmentTicket)
    .post('/enrollOrganization', enrollOrganizationViaEnrollmentTicket)

export {
    organizationUserRouter
}