import mongoose, { connect } from "mongoose";

import { options } from "./config.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(options.mongo.url);
        console.log("Mongo DataBase Connected")
    } catch (error) {
        console.log(`Error en la conexión a la BD ${error.message}`);
    }
}