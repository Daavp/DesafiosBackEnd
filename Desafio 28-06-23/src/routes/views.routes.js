import { Router, json, response } from "express";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();

//render del home
router.get("/",ViewsController.viewsHome);
//Productos en tiempo real
router.get("/realTimeProducts", ViewsController.viewsRealTimeProducts);
//Render de chat
router.get("/chat",ViewsController.viewsChat);
//render productos con botones// Tiene datos de login de usuario para inicio
router.get("/products",ViewsController.viewsProducts);

router.get('/carts/:cid', ViewsController.viewsCartById);

router.get("/products/:pid", ViewsController.viewsProductById);
//login
router.get("/login",ViewsController.viewsLogin);
//signup
router.get("/signup", ViewsController.viewsSignup);
//profile
router.get("/profile", ViewsController.viewsProfile);

export {router as viewsRouter};