import { Router } from "express";
import { checkRoles, UserAuthviews } from "../middlewares/auth.js";
import { userController } from "../controllers/users.controller.js";

const router = Router();

//Ruta usuarios Premium
router.put("/premium/:uid", UserAuthviews, checkRoles(["admin"]),
userController.modifyRole)

export {router as userRouter}; 