import {Router, json} from "express";
import { ProductManager } from "../dao/managers/productManager.js";
import { productsModel } from "../models/products.model.js";
import { productManagerDb } from "../dao/managers/productManager.mongo.js";


const manager = new productManagerDb();
//Grupo de rutas de products
const router = Router();

// Rutas de usuarios Metodos GET     //Obtener productos con ?LIMIT
router.get("/",async (req,res)=>{ //USO DE QUERY http://localhost:8080/api/products?limit= numero
    try {
        const limit = req.query.limit;
        if(!limit){
         // Todos los productos
            const allProducts = await manager.getProducts();      
            return res.json({status:"success", data: allProducts}); //Aqui va lo que se obtiene del resultado 
            };
        // Limite de producto                       
            const limitProducts = await manager.getProducts(limit);
            return res.json({status:"success", data:limitProducts});
        } catch (error) {
            res.status(500).send({status:"Error al obtener los productos"});
        }
});
/* //Obtener productos con /:pid // Busqueda de ID PARAMS CON FS
router.get("/:pid",async (req,res)=>{
    try {
        //const allProducts = await manager.getProductById(); PARA FS
        const allProducts = await manager.getProductById(req.params.pid);
        //const idProduct = parseInt(req.params.pid); PARA FS
        //const searchProduct = allProducts.find(u=>u.id === idProduct); //Busqueda de numero ID FS
        if(!searchProduct){ //Si no lo encuentra da mensaje
            return res.send(`Producto con el id ${idProduct} no existe, intenta con otro numero.`)
        };
        res.send(searchProduct);//Si lo encuentra entrega el producto
    }
     catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
}); */

router.get("/:pid",async (req,res)=>{ //BUSQUEDA ID PARAMS MONGO
    try {
        const data = await manager.getProductById(req.params.pid);
        if(!data){ //Si no lo encuentra da mensaje
            return res.send(`Producto con el id ${req.params.pid} no existe, intenta con otro ID.`)
        };
        res.send(data);//Si lo encuentra entrega el producto
    }
     catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});
// Rutas de Productos Metodos POST => Nuevo producto con id autogenerable  OK AMBOS   //Crear productos
router.post("/",async(req,res)=>{
    try {
        const {title,description,code,price,status,stock,category,thumbnails} = req.body;
        const newProduct = req.body;
        const productSaved = await manager.addProduct(newProduct);
        res.json({status:"success", message:"Producto creado", data:productSaved}); //Mensaje de exito de producto creado
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
});

/* // Rutas de Productos Metodos PUT => NO DEBE ACTUALIZAR O ELIMINAR ID  // PARA FS   //Actualizar productos con /:pid
    router.put("/:pid",async (req,res)=>{
        try {
            const updateData = req.body;
            if(updateData.id){
               return res.status(400).send({status:"No puedes modificar o eliminar el id de productos ya existentes"});
            };
            console.log("Podemos buscar para modificar");
            const idProduct = parseInt(req.params.pid);
            const updateProduct = await manager.updateProduct(idProduct,updateData);
            return res.json({status:"success",message:updateProduct,data:updateData});//Producto modificado
        }
         catch (error) {
            return res.status(500).send({message:error.message});
        }
    }); */

    // Rutas de Productos Metodos PUT => NO DEBE ACTUALIZAR O ELIMINAR ID  // PARA MONGO   //Actualizar productos con /:pid
    router.put("/:pid",async (req,res)=>{
        try {
            const productId = req.params.pid;
            const updateData = req.body;
            if(updateData._id != productId){
               return res.status(400).send({status:"No puedes modificar o eliminar el id de productos ya existentesen la DB"});
            };
            console.log("Podemos buscar para modificar");
            const updateProduct = await manager.updateProduct(productId,updateData);
            return res.json({status:"success",message:"Producto modificado con exito",data:updateProduct});//Producto modificado
        }
         catch (error) {
            return res.status(500).send({message:error.message});
        }
    });

/* // Rutas de Productos Metodos DELETE =>  //Eliminar productos con /:pid //PARA FS
    router.delete("/:pid",async (req,res)=>{
        try {
            console.log("Podemos eliminar");
            const idProduct = parseInt(req.params.pid);
            const deleteProduct = await manager.deleteProduct(idProduct);
            return res.json({status:"success",message:`Producto con id:${idProduct} eliminado.`});//Producto eliminado
        }
         catch (error) {
            return res.status(500).send({message:error.message});
        }
    }); */    

// Rutas de Productos Metodos DELETE =>  //Eliminar productos con /:pid PARA MONGO
router.delete("/:pid",async (req,res)=>{
    try {
        console.log("Podemos eliminar");
        const idProduct = req.params.pid;
        const deleteProduct = await manager.deleteProduct(idProduct);
        return res.json({status:"success",message:`Producto con id:${idProduct} eliminado.`});//Producto eliminado
    }
     catch (error) {
        return res.status(500).send({message:error.message});
    }
});  

export {router as routerProducts};