import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import { options } from "./config/config.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Crear hash
export const createHash = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync())
};
//Comprar contraseñas// Arroja true o false
export const passValidator = (password,user)=>{
    return bcrypt.compareSync(password,user.password); //Password= contraseña login//User = datos BD

};
export const verifyEmailToken = (token)=> {
    try {
        const info = jwt.verify(token,options.server.secretToken);
        return info.email;
    } catch (error) {
        return null;
    }
}