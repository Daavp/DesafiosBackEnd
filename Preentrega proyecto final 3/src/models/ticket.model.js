import mongoose, { Schema } from "mongoose";
const ticketCollection = "tickets"; //nombre de la colleccion de la base de datos.

//schema

const ticketsSchema = new mongoose.Schema({
    code:{type:String,required:true},
    purchaseDatetime:{type:String,required:true},
    products:{
        type:[{
            product:{
                type:mongoose.SchemaTypes.ObjectId,
                ref:"products"
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            }
        }],
        required:true,  //obligatorio

    },
    amount:{type:Number, required:true},
    purchaser:{type:String, required:true}
});

ticketsSchema.pre('findOne',function(){
    this.populate("products.product")
});

// modelo para realizar operaciones en la coleccion
export const ticketsModel = mongoose.model(ticketCollection,ticketsSchema);