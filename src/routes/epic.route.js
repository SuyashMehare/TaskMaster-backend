import { Router } from "express";
import { createOrganisation, createProductEpic } from "../controllers/index.js";
const epicRouter = Router();

epicRouter.post('/create', createProductEpic);

export {
    epicRouter
}