import { Router } from "express";
import { testOrg } from "../controllers/index.js";
const organisationRouter = Router();

organisationRouter.post('/register', testOrg);

export {
    organisationRouter
}