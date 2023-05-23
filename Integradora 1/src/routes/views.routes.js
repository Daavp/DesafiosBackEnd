import { Router } from "express";
import { ProductManager } from "../dao/managers/productManager.js";
import { productManagerDb } from "../dao/managers/productManager.mongo.js";
import { options } from "../config/options.js";

const manager = new productManagerDb();
const router = Router();

//Endpoints
//Render de productos
router.get("/",async (req,res)=>{
    try {
        const allProducts = await manager.getProducts();
        res.render("home",{allProducts}); //Aqui mostrar todos los productos del archivo
    } catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});

//Productos en tiempo real
router.get("/realTimeProducts", async (req,res)=>{
    try {
        const allProducts = await manager.getProducts();
        res.render("realTimeProducts",{allProducts}); //Aqui mostrar todos los productos del archivo
    } catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});
//Render de chat
router.get("/chat",(req,res)=>{
    res.render("chat");
});

export {router as viewsRouter};