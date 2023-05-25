import { Router } from "express";
import { ProductManager } from "../dao/managers/productManager.js";
import { productManagerDb } from "../dao/managers/productManager.mongo.js";
import { options } from "../config/options.js";
import { chatMongo } from "../dao/managers/chatMongo.js";

const manager = new productManagerDb();
const chatService = new chatMongo();
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
router.get("/chat",async (req,res)=>{
try {
    const allMessages = await chatService.getMessages();
    res.render("chat"),{allMessages};
    console.log ("En el try del render chat");
    } catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});

export {router as viewsRouter};