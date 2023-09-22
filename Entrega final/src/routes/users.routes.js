import { Router } from "express";
import { checkRoles, UserAuthviews } from "../middlewares/auth.js";
import { userController } from "../controllers/users.controller.js";
import { uploaderUserDoc } from "../utils.js";

const router = Router();

//Ruta usuarios Premium
router.put("/premium/:uid", UserAuthviews, checkRoles(["admin"]),
userController.modifyRole);
router.post("/:uid/documents",UserAuthviews, uploaderUserDoc.fields([{name:"identificacion",maxCount:1},{name:"domicilio",maxCount:1},{name:"estadoDeCuenta",maxCount:1}]), userController.uploadDocuments)
router.get("/", UserAuthviews, userController.getUsers);
router.get("/getUsersToDelete", UserAuthviews, userController.getUsersToDelete);
router.delete("/deleteUser/:userid", UserAuthviews, checkRoles(["admin"]),  userController.deleteUser);
export {router as userRouter}; 