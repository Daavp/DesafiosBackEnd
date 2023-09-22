import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import { options } from "./config/config.js";
import multer from "multer";

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
};

//Definir storages de multer
//Filtro de campos de registro
//Validar campos
const checkFields = (body)=> {
    const {first_name, email, password} = body;
    if(!first_name || !email || !password){
        return false;
    } else {
        return true;
    }
};
//Filtrar datos antes de guardar la imagen
const multerProfileFilter = (req,file,cb)=> {
    const validFields = checkFields(req.body);
    if(!validFields){
        cb(null, false);
    } else {
        cb(null, true);
    }
}
//Config de imagenes
const profileStorage =  multer.diskStorage({
    //Donde se guardan
    destination: function(req, file, cb){
        cb(null,path.join(__dirname,"/multer/users/images"))
    },
    //Nombre del archivo
    filename: function(req,file, cb){
        cb(null,`${req.body.email}-perfil-${file.originalname}`)
    }
});
//Uploader
export const uploadProfile = multer({storage:profileStorage, fileFilter:multerProfileFilter});

//Config de userDocuments
const userDocStorage =  multer.diskStorage({
    //Donde se guardan
    destination: function(req, file, cb){
        cb(null,path.join(__dirname,"/multer/users/documents"))
    },
    //Nombre del archivo
    filename: function(req,file, cb){
        cb(null,`${req.user.email}-document-${file.originalname}`)
    }
});
//Uploader
export const uploaderUserDoc = multer({storage:userDocStorage});

//Config de productImage
const imgProductStorage =  multer.diskStorage({
    //Donde se guardan
    destination: function(req, file, cb){
        cb(null,path.join(__dirname,"/multer/products/images"))
    },
    //Nombre del archivo
    filename: function(req,file, cb){
        cb(null,`${req.body.email}-imgProduct-${file.originalname}`)
    }
});
//Uploader
export const uploaderProductImg = multer({storage:imgProductStorage});