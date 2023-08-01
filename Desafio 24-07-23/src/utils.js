import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';


export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Crear hash
export const createHash = (password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync())
};
//Comprar contraseñas// Arroja true o false
export const passValidator = (password,user)=>{
    return bcrypt.compareSync(password,user.password); //Password= contraseña login//User = datos BD

};