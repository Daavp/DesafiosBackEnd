import passport, { Passport } from "passport";
import localStrategy from "passport-local" ;
import githubStrategy from "passport-github2";
import { userModel } from "../models/users.model.js";
import { createHash, passValidator } from "../utils.js";
import { json } from "express";

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
            const user = await userModel.findOne({email:username});//1:33
            try {
                if(!user){//Si no encuentra, registrar al usuario
                    if(userForm.email.endsWith('@coder.com')){//verificacion coder
                        console.log("Es usuario Coder!");
                        const newUserCoder = {
                            first_name:userSignupForm.first_name,
                            last_name:userSignupForm.last_name,
                            email:userSignupForm.email,
                            age:userSignupForm.age,
                            password:createHash(password),
                            role:"admin"
                        };
                       const userCoderCreated = await userModel.create(newUserCoder);
                        return done(null,userCoderCreated)};
                const newUserCreated = {
                    first_name:userSignupForm.first_name,
                    last_name:userSignupForm.last_name,
                    email:userSignupForm.email,
                    age:userSignupForm.age,
                    password:createHash(password)
                };
                const userCreated = await userModel.create(newUserCreated);
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
                const userDB = await userModel.findOne({email:username});
                if(userDB){//Si encuentra verificar password
                    if(passValidator(password,userDB)){
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
            clientID:"Iv1.2be13c2545f8c0ee",
            clientSecret:"21611e43dec991328ff016b243893fe2e09b5492",
            callbackUrl:"http://localhost:8080/api/sessions/githubCallback"
        },
        async(accesstoken,refreshtoken,profile,done)=>{
            try {
/*                 console.log("profile",profile); */
                const user = await userModel.findOne({email:profile.username});
                if(!user){//Si no encuentra, registrar al usuario
/*                     if(userForm.email.endsWith('@coder.com')){//verificacion coder
                        console.log("Es usuario Coder!");
                        const newUserCoder = {
                            first_name:userSignupForm.first_name,
                            last_name:userSignupForm.last_name,
                            email:userSignupForm.email,
                            age:userSignupForm.age,
                            password:createHash(password),
                            role:"admin"
                        };
                       const userCoderCreated = await userModel.create(newUserCoder);
                        return done(null,userCoderCreated)}; */
                const newUserCreated = {
                    first_name:profile.username,
                    last_name:"",
                    email:profile.username,
                    age:null,
                    password:createHash(profile.id)
                };
                console.log(newUserCreated);
                const userCreated = await userModel.create(newUserCreated);
                
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
        const userDB = await userModel.findById(id);
        const transformUserDB = JSON.parse(JSON.stringify(userDB));
        done(null,transformUserDB); //req.user = userDB
    })

}