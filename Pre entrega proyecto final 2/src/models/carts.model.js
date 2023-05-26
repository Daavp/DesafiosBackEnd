import mongoose, { Schema } from "mongoose";

const cartsCollection = "carts"; //nombre de la colleccion de la base de datos.

//schema

const cartsSchema = new mongoose.Schema({
    products:{
        type:Array,
        required:true,  //obligatorio
        default:[]
    }
});
// modelo para realizar operaciones en la coleccion
export const cartsModel = mongoose.model(cartsCollection,cartsSchema);