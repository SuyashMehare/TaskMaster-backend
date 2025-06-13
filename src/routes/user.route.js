import { Router } from "express";
import { createUser, test } from "../controllers/index.js";
const userRouter = Router();

userRouter.post('/register', createUser);
userRouter.get('/test', test);

export {
    userRouter
}