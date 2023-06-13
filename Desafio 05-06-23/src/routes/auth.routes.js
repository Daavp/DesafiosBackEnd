import { Router } from "express";
import { userModel } from "../models/users.model.js";
import { createHash } from "../utils.js";
import passport from "passport";

const router = Router();

//Ruta de registro PASSPORT
router.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect:"/api/sessions/signup-failed"// proceso en caso de fallas
}) ,(req,res)=>{//proceso si exito
    res.send('<div> Registro completado con exito, inicie sesión con sus datos <a href="/login">Inicie sesión en la pagina de login</a></div>')
});
//Ruta Failure REGISTRO PASSPORT
router.get("/signup-failed",(req,res)=>{
    res.send('<div>Error al registrar con los datos ingresados, <a href="/signup">Intente nuevamente</a></div>')

});
//Rutas LOGIN PASSPORT
router.post("/login",passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/login-failed"// proceso en caso de fallas
}) ,(req,res)=>{//proceso si exito
    return res.redirect("/products?page=1");
});
//Ruta Failure LOGIN PASSPORT
router.get("/login-failed",(req,res)=>{
    res.send('<div>Hubo un error al iniciar sesión, <a href="/signup">Intente nuevamente</a></div>')

});
//Ruta para registro con GITHUB
router.get("/github",passport.authenticate("githubSignup"));

router.get("/githubCallback",
    passport.authenticate("githubSignup",{
        failureRedirect: "/api/sessions/signup-failed"
    }),
    (req,res)=>{
        res.redirect("/products?page=1")
    }
)

//Ruta LOGOUT 
router.get("/logout",(req,res)=>{
    req.logOut(error=>{
        if(error){//elimina req.user y limpia session actual
            return res.send('No se pudo cerrar sesión <a href:"/profile"> ir al perfil </a>');
        } else{
            req.session.destroy(err=>{//Elimina session de la BD
                if(err) return res.send('No se pudo cerrar sesión <a href:"/profile"> ir al perfil </a>');
                res.redirect("/")
            });
        }
    })

});


export {router as authRouter};