import { test, createUser } from "./user.controller.js";
import { testOrg, createOrganisation, fetchOrganizationDetails } from "./organisation.controller.js";
import { createOrganisationProduct } from "./product.controller.js";
import { createProductEpic } from "./epic.controller.js";

import {
    loginOrganizationAdmin, 
    loginOrganizationOwner, 
    loginOrganizationMember,
    createUserEnrollmentTicket,
    enrollOrganizationViaEnrollmentTicket,
    loginUserByLoginOne
} from "./organisationUser.controller.js";

export {
    test,
    testOrg,
    
    createUser,
    createOrganisation,
    loginOrganizationAdmin, 
    loginOrganizationOwner, 
    loginOrganizationMember,
    loginUserByLoginOne,

    fetchOrganizationDetails,

    createUserEnrollmentTicket,
    enrollOrganizationViaEnrollmentTicket,
    createOrganisationProduct,
    createProductEpic,

}

// export * from './user.controller.js';
// export * from './organisation.controller.js';