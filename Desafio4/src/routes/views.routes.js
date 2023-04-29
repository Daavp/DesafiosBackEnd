import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

const manager = new ProductManager("products.json");
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


export {router as viewsRouter};