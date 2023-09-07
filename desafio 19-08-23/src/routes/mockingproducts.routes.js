import { Router } from "express";
import { mockingController } from "../controllers/mockingProducts.controller.js"; 
const router = Router();

router.get("/",mockingController.productsGenerator);

export {router as mockingproductsRouter};