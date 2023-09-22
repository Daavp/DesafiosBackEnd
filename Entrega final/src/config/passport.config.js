import passport, { Passport } from "passport";
import localStrategy from "passport-local" ;
import githubStrategy from "passport-github2";
import { createHash, passValidator } from "../utils.js";
import { options } from "./config.js";
import { UsersService } from "../services/users.service.js";
import { cartsService } from "../services/carts.service.js";
import { userDto } from "../dao/dto/user.dto.js";
import { logger } from "../utils/logger.js";

//La logica de validacion va a quedar aqui
export const initializePassport = ()=>{ //Aqui van las estrategias
    //Estrategia para registrar usuario
    passport.use("signupStrategy",new localStrategy(
        {
            usernameField:"email",//ahora username es el email
            passReqToCallback:true //se pasa req a la siguiente funcion
        }, 
        async(req, username, password, done)=>{
            const userSignupForm = req.body;
            const user = await UsersService.getUserByEmail(username);//1:33
            console.log("Intentando registrar");
            try {
                if(!user){//Si no encuentra, registrar al usuario
                    if(userSignupForm.email.endsWith('@coder.com')){//verificacion coder
                        console.log("Es usuario Coder!");
                        const coderCart = await cartsService.addCart();
                        const newUserCoder = {
                            first_name:userSignupForm.first_name,
                            last_name:userSignupForm.last_name,
                            email:userSignupForm.email,
                            age:userSignupForm.age,
                            password:createHash(password),
                            role:"admin",
                            cart:coderCart,
                            avatar:req.file.filename
                        };
                       const userCoderCreated = await UsersService.saveUser(newUserCoder);
                        return done(null,userCoderCreated)};
                        //Otros users
                const userCart = await cartsService.addCart();  
                const newUserCreated = {
                    first_name:userSignupForm.first_name,
                    last_name:userSignupForm.last_name,
                    email:userSignupForm.email,
                    age:userSignupForm.age,
                    password:createHash(password),
                    cart:userCart,
                    avatar:req.file.filename
                };
                const userCreated = await UsersService.saveUser(newUserCreated);
                return done(null,userCreated)
            } else{
                return done(null,false)//(error,user) si se encuentra da false
            };
                
            } catch (error) {
                return done(error)
            }
        }
    ));
    //Estrategia login
    passport.use("loginStrategy", new localStrategy(
        {
            usernameField:"email",
        },
        async(username, password, done)=>{
            try {
                //Validacion de correo
                const userDB = await UsersService.getUserByEmail(username);
                if(userDB){//Si encuentra verificar password
                    if(passValidator(password,userDB)){
                        //Pass valida, modificamos propiedad last conection
                        const lastConnection = new Date();
                        lastConnection.setHours(0);
                        userDB.last_connection = lastConnection;
                        await UsersService.updateUser(userDB._id,userDB);
                        return done(null, userDB);
                    }else{
                        return done(null, false);
                    }
                } else{
                    return done(null, false)
                } 
            } catch (error) {
                return done(error)
            }
        }
    ));
    //Estrategia de registro con GitHub
    passport.use("githubSignup", new githubStrategy(
        {
            clientID:options.githubConfig.clientId,
            clientSecret:options.githubConfig.clientSecret,
            callbackUrl:"http://localhost:8080/api/sessions/githubCallback"
        },
        async(accesstoken,refreshtoken,profile,done)=>{
            try {
/*                 console.log("profile",profile); */
                const user = await UsersService.getUserByEmail(profile.username);
                if(!user){//Si no encuentra, registrar al usuario
                const userCart = await cartsService.addCart(); 
                const newUserCreated = {
                    first_name:profile.username,
                    last_name:"",
                    email:profile.username,
                    age:null,
                    password:createHash(profile.id),
                    cart:userCart
                };
                console.log(newUserCreated);
                const userCreated = await UsersService.saveUser(newUserCreated);
                
                return done(null,userCreated)
            } else{
                return done(null,false)//(error,user) si se encuentra da false
            };
            } catch (error) {
                return done(error)
            }
        }
    ));

    //Serializacion y deserializacion
    passport.serializeUser((user,done)=>{
        done(null,user._id); // En req.session guarda el id de usuario
    });
    passport.deserializeUser(async(id,done)=>{
        const userDB = await UsersService.getUserById(id);
        const userData = new userDto(userDB);
        const transformUserDB = JSON.parse(JSON.stringify(userData));
        logger.debug("Userdata passport", transformUserDB)
        done(null,transformUserDB); //req.user = userDB
    })

}