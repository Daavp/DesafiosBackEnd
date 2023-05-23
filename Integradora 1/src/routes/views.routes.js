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
/* router.get("/realTimeProductsDB", async(req,res)=>{
    try {
        const products = await productsModel.find(); //find en la DB
        return res.render("realTimeProducts",{products});
    } catch (error) {
        console.log(error.message);
        res.status(500).send({status:"Error al obtener los productos"})
    }
    }); */

export {router as viewsRouter};