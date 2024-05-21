import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const userRouter = express.Router();

userRouter
    .post("/", jwtCheck, MyUserController.createCurrentUser)
    .put("/", jwtCheck, jwtParse, validateMyUserRequest, MyUserController.updateCurrentUser)
    .get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser)

export default userRouter;