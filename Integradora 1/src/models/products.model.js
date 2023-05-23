import mongoose, { Schema } from "mongoose";

const productsCollection = "products"; //nombre de la colleccion de la base de datos.

//schema

const productsSchema = new mongoose.Schema({
    //definición propiedades para los productos cuando guarda los datos en la DB
 // title:title,   // description:description,   // code:productId,   // price:price,   // status   // stock:stock   // category   // thumbnails:thumbnails,

    title:{
        type:String,
        required:true  //obligatorio
    },
    description:{
        type:String,
        required:true  //obligatorio
    },
    code: {
        type:String,
        required:true,  //obligatorio
        unique:true,    //Valor unico
    },
    price:{
        type:Number,
        required:true  //obligatorio
    },
    status:{
        type:Boolean,
        default:true
    },
    stock:{
        type:Number,
        required:true  //obligatorio
    },
    category:{
        type:String,
        required:true  //obligatorio
    },
    thumbnails:{
        type:String
    }
});
// modelo para realizar operaciones en la coleccion
export const productsModel = mongoose.model(productsCollection,productsSchema);