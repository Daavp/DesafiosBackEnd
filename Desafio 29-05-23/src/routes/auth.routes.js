import { Router } from "express";
import { userModel } from "../models/users.model.js";

const router = Router();

//Ruta de registro
router.post("/signup",async(req,res)=>{
    try {
        const userForm = req.body;
        //Validacion de correo
        const user = await userModel.findOne({email:userForm.email})
        if(!user){//Si no encuentra, registrar al usuario
                if(userForm.email.endsWith('@coder.com')){//verificacion coder
                    console.log("Es usuario Coder!");
                   await userModel.create({
                        first_name:userForm.first_name,
                        last_name:userForm.last_name,
                        email:userForm.email,
                        age:userForm.age,
                        password:userForm.password,
                        role:"admin"
                    });
                    return res.send('<div> Registro completado con exito, inicie sesión con sus datos <a href="/login">Inicie sesión en la pagina de login</a></div>')};
            const userCreated = await userModel.create(userForm);
           res.send('<div> Registro completado con exito, inicie sesión con sus datos <a href="/login">Inicie sesión en la pagina de login</a></div>')
        } else{
            res.send('<div> Usuario ya registrado, intente nuevamente<a href="/signup">Volver a registrarse</a></div>')
        };
    } catch (error) {
        res.send('<div>Error al registrar con los datos ingresados, <a href="/signup">Intente nuevamente</a></div>')
        console.log(error);
    }
});
//Ruta de logeo de usuario
router.post("/login",async(req,res)=>{
    try {
        const userLoginForm = req.body;
        //Validacion de correo
        const userDB = await userModel.findOne({email:userLoginForm.email})
        if(userDB){//Si encuentra verificar password
            if(userDB.password === userLoginForm.password){
                req.session.user = {
                    first_name: userDB.first_name,
                    last_name: userDB.last_name,
                    email: userDB.email,
                    role: userDB.role
                };
                return res.redirect("/products?page=1");
            }else{
                return res.send('<div> Correo o contraseña invalidas <a href=/login>Intenta nuevamente</a></div>')
            }
        } else{//Si no lo encuentra registrar o reintentar
            res.send('<div> Usuario no registrado <a href="/signup">Registrarse</a> o <a href="/login">Intentar nuevamente</a></div>')
        };
    } catch (error) {
        res.send('<div>Hubo un error al iniciar sesión, <a href="/signup">Intente nuevamente</a></div>')
    }
});
router.get("/logout",(req,res)=>{
    req.session.destroy(err=>{
        if(err) {
        return res.send('No se pudo cerrar sesión <a href:"/profile"> ir al perfil </a>');
        }
        res.redirect("/")
    });
});

export {router as authRouter};