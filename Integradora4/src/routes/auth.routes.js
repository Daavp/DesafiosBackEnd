import { Router } from "express";
import passport from "passport";
import { SessionsController } from "../controllers/sessions.controller.js";
import { uploadProfile } from "../utils.js";

const router = Router();
//Ruta de registro PASSPORT
router.post("/signup", uploadProfile.single("avatar"), passport.authenticate("signupStrategy",{
    failureRedirect:"/api/sessions/signup-failed"// proceso en caso de fallas
}) ,SessionsController.registerStrategy);

//Ruta Failure REGISTRO PASSPORT
router.get("/signup-failed",SessionsController.registerStrategyFailure);

//Rutas LOGIN PASSPORT
router.post("/login",passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/login-failed"// proceso en caso de fallas
}) ,SessionsController.loginStrategy);

//Ruta Failure LOGIN PASSPORT
router.get("/login-failed",SessionsController.loginStrategyFailure);

//Ruta para registro con GITHUB
router.get("/github",passport.authenticate("githubSignup"));
router.get("/githubCallback",
    passport.authenticate("githubSignup",{
        failureRedirect: "/api/sessions/signup-failed"
    }),
    (req,res)=>{
        res.redirect("/products?page=1")
    }
);
//Ruta LOGOUT 
router.get("/logout",SessionsController.logoutStrategy);
//Forgot password
router.post("/forgot-password",SessionsController.sendRecovery);
//Ruta para cambiar contraseña
router.post("/reset-password", SessionsController.resetPassword)


//Exportacion
export {router as authRouter};