import { Router } from "express";
import { createOrganisationProduct, getOrganisationProducts } from "../controllers/index.js";
const productRouter = Router();

productRouter
.post('/create', createOrganisationProduct)
.post('/all', getOrganisationProducts);

export {
    productRouter
}