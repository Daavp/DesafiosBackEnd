import mongoose, { connect } from "mongoose";

import { options } from "./config.js";
import { logger } from "../utils/logger.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(options.mongo.url);
        logger.info("Mongo DataBase Connected")
    } catch (error) {
        logger.fatal(`Error en la conexión a la BD`);
    }
}