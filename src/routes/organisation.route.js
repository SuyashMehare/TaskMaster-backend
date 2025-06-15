import { Router } from "express";
import { createOrganisation, fetchOrganizationDetails } from "../controllers/index.js";
const organisationRouter = Router();

organisationRouter
.post('/register', createOrganisation)
.post('/details', fetchOrganizationDetails)


export {
    organisationRouter
}