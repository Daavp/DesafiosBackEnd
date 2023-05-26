import {Router} from "express";
import { CartManager } from "../dao/managers/cartManager.js";
import { ProductManager } from "../dao/managers/productManager.js";
import { productManagerDb } from "../dao/managers/productManager.mongo.js";
import { cartsManagerDb } from "../dao/managers/cartManager.mongo.js";
import { connectDB } from "../config/dbConnection.js";

const cartManager = new cartsManagerDb();
const productManager = new productManagerDb();
//Grupo de rutas de products
const router = Router();

// Rutas de Productos Metodos POST => crear nuevo carrito. id:number NO SE DEBEN DUPLICAR AUTOGENERABLE, products: array que contendra objetos que representen cada producto
    //Crear carrito con /api/carts/:cid
router.post("/",async(req,res)=>{
    try {
        const cartCreated = await cartManager.addCart();
        res.json({status:"success", data:cartCreated }); //Mensaje de exito de carrito creado
    } catch (error) {
        res.status(500).send({status:"error", message:error.message});
    }

});
// Rutas de Productos Metodos GET
    //Mostrar carrito y listar productos carrito con /:cid
    router.get("/:cid",async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const cart= await cartManager.getCartById(cartId);
            if(cart){
                res.json({status:"success", data:cart }); //Mensaje de carrito encontrado
            } else {
                res.status(400).json({status:"error", message:"Carrito no existe"});
            }
            
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    
    });

// Rutas de Productos Metodos POST /:cid/product/:pid
    //debe agregar el producto al arreglo products del carrito seleccionado
        //product:debe contener ID del producto solamente. quantity: debe contener numero de ejemplares del producto, se agregará uno a uno. Si ya existe producto se debe agregar
        //al producto  e incrementar el campo quantity del producto.    
router.post("/:cid/product/:pid", async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart= await cartManager.getCartById(cartId);
        if(cart){
            const product = await productManager.getProductById(productId);
            if(product){
                const response = await cartManager.addProductToCart(cartId,productId);
                connectDB();
                res.json({status:"success",message:response});
            }else {
                res.status(400).json({status:"error", message:"Producto solicitado no existe"});
            }
        } else {
            res.status(400).json({status:"error", message:"Carrito no existe"});
        }
        
    } catch (error) {
        res.status(500).json({status:"error", message:error.message});
    }

});

export {router as routerCart};