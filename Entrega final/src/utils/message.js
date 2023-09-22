import { options } from "../config/config.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//Funcion token para enlace

export const generateEmailToken = (email,expireTime) => {
    const token = jwt.sign({email}, options.server.secretToken, {expiresIn:expireTime});
    return token;
};

//Transporter nodemailer (GMAIL)
const transporter =nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:options.gmail.adminEmail,
        pass:options.gmail.adminPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

//Funcion formato correo recuperación
export const sendRecoveryEmail = async(userEmail,token) => {
    //Link con el token y expiración
    const link= `http://localhost:8080/reset-password?token=${token}`;

    //Enviar correo
    await transporter.sendMail({
        //Estructura/formato correo
        from:"Ecommerce",
        to:userEmail,
        subject:"Restablecer de contraseña",
        html:`
        <div>

        <h2>Hola, estas restableciendo tu contraseña</h2>

        <p>Da clic para restablecer tu contraseña</p>

        <a href="${link}">

            <button>Restablecer mi contraseña</button>

        </a>

        </div>
        `


    })
};
export const deleteUserEmail = async(userEmail) => {
    //Enviar correo
    await transporter.sendMail({
        //Estructura/formato correo
        from:"Ecommerce",
        to:userEmail,
        subject:"Tu cuenta ha sido eliminada por inactividad prolongada",
        html:`
        <div>

        <h2>Hola, este correo es para informar que tu cuenta con nosotros fue eliminada por inactividad</h2>

        <p>Puedes volver a registrarte para continuar usando nuestros servicios, que tengas un buen día</p>


        </div>
        `


    })
};
export const deleteUserEmailPremium = async(userEmail, htmlMessage) => {
    //Enviar correo
    await transporter.sendMail({
        //Estructura/formato correo
        from:"Ecommerce",
        to:userEmail,
        subject:"Tu cuenta ha sido eliminada por inactividad prolongada",
        html: htmlMessage


    })
};