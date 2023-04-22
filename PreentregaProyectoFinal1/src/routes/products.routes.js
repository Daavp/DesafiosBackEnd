import {Router} from "express";
import { ProductManager } from "../managers/productManager.js";

const manager = new ProductManager("products.json");
//Grupo de rutas de products
const router = Router();
// Rutas de usuarios Metodos GET     //Obtener productos con ?LIMIT
router.get("/",async (req,res)=>{ //USO DE QUERY http://localhost:8080/api/products?limit= numero
    try {
        const allProducts = await manager.getProducts();
        const limit = req.query.limit;
        if(!limit){
         // Todos los productos      
            return res.json({status:"success", data: allProducts}); //Aqui va lo que se obtiene del resultado 
            };
        // Limite de producto                       
            const productsLimit = parseInt(req.query.limit);
            const productsDisplay = allProducts.filter(u=>u.id <=productsLimit);
            return res.json({status:"success", data:productsDisplay});
        } catch (error) {
            res.status(500).send({status:"Error al obtener los productos"});
        }
});
//Obtener productos con /:pid // Busqueda de ID PARAMS
router.get("/:pid",async (req,res)=>{
    try {
        const allProducts = await manager.getProducts();
        const idProduct = parseInt(req.params.pid);
        const searchProduct = allProducts.find(u=>u.id === idProduct); //Busqueda de numero ID
        if(!searchProduct){ //Si no lo encuentra da mensaje
            return res.send(`Producto con el id ${idProduct} no existe, intenta con otro numero.`)
        };
        res.send(searchProduct);//Si lo encuentra entrega el producto
    }
     catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});
// Rutas de Productos Metodos POST => Nuevo producto con id autogenerable     //Crear productos
router.post("/",async(req,res)=>{
    try {
        const {title,description,code,price,status,stock,category,thumbnails} = req.body;
        const newProduct = req.body;
        const productSaved = await manager.addProduct(newProduct);
        res.json({status:"success", message:"Producto creado", data:productSaved}); //Mensaje de exito de producto creado
    } catch (error) {
        res.status(500).send({status:"Error al ingresar los campos requeridos, faltan datos."});
    }
});

// Rutas de Productos Metodos PUT => NO DEBE ACTUALIZAR O ELIMINAR ID     //Actualizar productos con /:pid
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
    });

// Rutas de Productos Metodos DELETE =>  //Eliminar productos con /:pid
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
    });

export {router as routerProducts};