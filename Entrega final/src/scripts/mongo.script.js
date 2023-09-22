import { productsModel } from "../models/products.model.js";
import mongoose from "mongoose";
import { options } from "../config/config.js";

await mongoose.connect(options.mongo.url);

//Actualizar todos los productos de la BD

const updateProducts = async()=>{
    try {
        //Verificando productos
/*         const products = await productsModel.find();
        console.log("Products MongoScript ",products); */ 
        const adminId="647eb271fcaa00065fb49e89";
        const result = await productsModel.updateMany({},{$set:{owner:adminId}}); //Set de admin a todos los productos
        console.log("Result ",result);
    } catch (error) {
        console.log(error.message)
    }
}
/* updateProducts(); */