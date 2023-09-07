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
        enum:["user","admin","premium"],
        required:true
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },
    documents:{
        type:[
            {
                name:{type:String, required:true},
                reference:{type:String, required:true}
            }
        ],
        default:[]
    },
    last_connection:{
        type:Date,
        default:null
    },
    status:{type:String, 
            required:true,
            enum:["Incompleto", "Completo", "Pendiente"],
            default:"Pendiente"
    },
    avatar:{
        type:String,
        default:''
    }
});

export const userModel = mongoose.model(usersCollection,usersSchema);