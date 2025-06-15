import { Router } from "express";
import { createOrganisationProduct } from "../controllers/index.js";
const productRouter = Router();

productRouter.post('/create', createOrganisationProduct);

export {
    productRouter
}