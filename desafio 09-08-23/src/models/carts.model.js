import mongoose, { Schema } from "mongoose";

const cartsCollection = "carts"; //nombre de la colleccion de la base de datos.

//schema

const cartsSchema = new mongoose.Schema({
    products:{
        type:[{
            product:{
                type:String,
                ref:"products"
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            }
        }],
        required:true,  //obligatorio
        default:[]
    }
});

cartsSchema.pre('findOne',function(){
    this.populate("products.product")
});

// modelo para realizar operaciones en la coleccion
export const cartsModel = mongoose.model(cartsCollection,cartsSchema);