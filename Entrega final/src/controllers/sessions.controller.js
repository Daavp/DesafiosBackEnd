import { UsersService } from "../services/users.service.js";
import { generateEmailToken } from "../utils/message.js";
import { sendRecoveryEmail } from "../utils/message.js";
import { verifyEmailToken, passValidator, createHash } from "../utils.js";

export class SessionsController{
    static registerStrategy(req,res){
        res.send('<div> Registro completado con exito, inicie sesión con sus datos <a href="/login">Inicie sesión en la pagina de login</a></div>')
    };
    static registerStrategyFailure(req,res){
        res.send('<div>Error al registrar con los datos ingresados, <a href="/signup">Intente nuevamente</a></div>')
    };
    static loginStrategy(req,res){
        return res.redirect("/products?page=1");
    };
    static loginStrategyFailure(req,res){
        res.send('<div>Hubo un error al iniciar sesión, <a href="/signup">Intente nuevamente</a></div>')
    };
    static logoutStrategy = async(req,res)=>{
            try {
                const userDB = await UsersService.getUserByEmail(req.user.email);
                userDB.last_connection = new Date();
                await UsersService.updateUser(userDB._id,userDB);
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
            } catch (error) {
                return res.send('Hubo un error al cerrar sesión')
            }
    };
    static sendRecovery = async(req,res)=>{
        const {email} = req.body;
        //Validar email existente
        try {
            const user = await UsersService.getUserByEmail(email);
            //Generar token de usuario y tiempo de expiración (Tiempo en segundos)
            const token = generateEmailToken(email,3*60)//3 minutos de tiempo
            //Enviar correo
            await sendRecoveryEmail(email,token);
            res.send("Se ha enviado un enlace de restablecimiento a tu correo");
        } catch (error) {
            res.json({status:"Error",message:error.message})
        }
    };
    static resetPassword = async(req,res)=>{

        try {
            const token = req.query.token;
            const {newPassword} = req.body;
            //Validacion Token
            const userEmail = verifyEmailToken(token);
            
            if(!userEmail){
                return res.send("El enlace esta caducado, genera un nuevo enlace <a href='/forgot-password'>genera un nuevo enlace aquí</a>")
            }
            //Validacion de que existe Email en DB
            const user = await UsersService.getUserByEmail(userEmail);
            
            //Si usuario existe, validar que la nueva contraseña sea diferente a anterior 
            if(passValidator(newPassword,user)){
                return res.render("resetPass",{error:"La contraseña no puede ser la misma", token})
            }
            //Contraseñas diferentes = Actualizacion
            const newUser = {
                ...user,
                password: createHash(newPassword)
            };
            console.log(newUser);
            await UsersService.updateUser(user._id,newUser);
            res.redirect("/login");
        } catch (error) {
            res.send("No se pudo restablecer la contraseña");
        }
    }
}