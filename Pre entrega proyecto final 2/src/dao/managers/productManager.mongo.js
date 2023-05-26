import path from "path";
import { __dirname } from "../../utils.js";
import { options } from "../../config/options.js";
import { productsModel } from "../../models/products.model.js";

export class productManagerDb {
    constructor (){
        this.model = productsModel;
    }

    async getProducts(limit){
        try {
            const data = await this.model.find().limit(limit);
            return data;
        } catch (error) {
            throw new Error(`Error al obtener los productos o no hay productos en la BD ${error.message}`);
        }
    };

    async getProductById(id){
        try {
            const data = await this.model.findById(id);
            if(!data){
                throw new Error(`El producto con el id ${id} no existe`);                
            };
            return data;
        } catch (error) {
            throw new Error(`Error al obtener el producto en la BD`);
        } 
    };

    async addProduct(product){
        try {
            const data = await this.model.create(product);
            return data;
        } catch (error) {
            throw new Error(`Error al crear el producto en la BD ${error.message}`);
        } 
    };
    async updateProduct(id,updateData){
        try {
            const data = await this.model.findByIdAndUpdate(id,updateData,{new:true});
            if(!data){
                throw new Error(`El producto con el id ${id} no existe`);                
            };
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar el producto en la BD ${error.message}`);
        } 
    };
    async deleteProduct(id){
        try {
            const data = await this.model.findByIdAndDelete(id);
            if(!data){
                throw new Error(`El producto con el id ${id} no existe`);                
            };
            return {message:"Producto eliminado"};
        } catch (error) {
            throw new Error(`Error al eliminar el producto en la BD ${error.message}`);
        } 
    };


};
/* //METODOS CON MONGOOSE

//EDITAR PRODUCTO CON ID en la BD
router.put("/productsdb/:pid", async(req,res)=>{
    try {
        const productId = req.params.pid;
        const updateData = req.body;
        if(updateData._id != productId){
           return res.status(400).send({status:"No puedes modificar o eliminar el id de productos ya existentesen la DB"});
        };

        console.log("Modificando archivo");

        const productUpdate = await productsModel.findByIdAndUpdate(productId,updateData,{new:true}); 
        res.json({status:"success", data:productUpdate});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error",message:"No se puede actualizar el producto en la BD"})
    }
});
//CREAR USUARIO CON DB
router.post("/productsdb", async(req,res)=>{
    try {
        const product = req.body;
        //Validación de datos
        if(!product.title||!product.description||!product.code||!product.price||!product.status||!product.stock||!product.category){
            return res.json({status:"error",message:"Los campos son invalidos, revisar datos ingresados"});
        };
        const newProduct = await productsModel.create(req.body);
        res.json({status:"success", data:newProduct});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error",message:"No se puede crear el producto"})
    }
});
//OBTENER PRODUCTOS CON LA DB //Obtener productos con ?LIMIT
router.get("/productsdb", async(req,res)=>{
    try {
       const limit = req.query.limit;
       console.log(limit); 
        if(!limit){
            // Todos los productos
               return res.json({status:"success", data: await productsModel.find()}); //Aqui va lo que se obtiene del resultado 
               };
               //Limite
        const products = await productsModel.find().limit(limit); //find en la DB
        return res.json({status:"success", data:products});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error",message:"No se puede entregar los productos"})
    }
    });
//OBTENER PRODUCTOS CON LA DB // Busqueda de ID PARAMS
router.get("/productsdb/:pid", async(req,res)=>{
    try {
        const productId = req.params.pid;
        const products = await productsModel.findById(productId).exec(); //find en la DB
        return res.json({status:"success", data:products});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error",message:"No se puede entregar los productos"})
    }
    });    
    //ELIMINAR PRODUCTOS CON LA DB // Busqueda de ID PARAMS
router.delete("/productsdb/:pid", async(req,res)=>{
    try {
        const productId = req.params.pid;
        const products = await productsModel.findByIdAndDelete(productId).exec(); //find en la DB
        return res.json({status:"success",message:"Producto eliminado", data:products});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error",message:"Producto eliminado o no existe"})
    }
    }); */