import mongoose, { mongo } from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:false
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user",
        required:true
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    }
});

export const userModel = mongoose.model(usersCollection,usersSchema);