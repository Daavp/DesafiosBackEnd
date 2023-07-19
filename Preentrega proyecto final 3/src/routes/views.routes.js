import { Router, json, response } from "express";
import { ViewsController } from "../controllers/views.controller.js";
import { checkRoles, UserAuthviews } from "../middlewares/auth.js";

const router = Router();

//render del home
router.get("/",ViewsController.viewsHome);
//Productos en tiempo real
router.get("/realTimeProducts", ViewsController.viewsRealTimeProducts);
//Render de chat
router.get("/chat", UserAuthviews,checkRoles(["user"]),ViewsController.viewsChat);
//render productos con botones// Tiene datos de login de usuario para inicio
router.get("/products",ViewsController.viewsProducts);

router.get('/carts/:cid', UserAuthviews,checkRoles(["user"]) , ViewsController.viewsCartById);

router.get("/products/:pid", ViewsController.viewsProductById);
//login
router.get("/login",UserAuthviews,ViewsController.viewsLogin);
//signup
router.get("/signup",UserAuthviews, ViewsController.viewsSignup);
//profile
router.get("/profile",  ViewsController.viewsProfile);
//TicketPurchase
router.get("/carts/:cid/purchase",  ViewsController.purchaseView);

export {router as viewsRouter};