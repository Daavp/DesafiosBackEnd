import exress from "express";
import { request } from "http";

const app = exress();

const port = 8080;

app.get("/", (request,response)=>{   
    response.send("Bienvenido a un servidor de express");
}); 
/* "/" significa que es la carpeta raiz 
para cada get se obtiene diferente información
*/

app.get("/bienvenido",(req,res)=>{
    res.send(`<p style="color:blue"> Bienvenida coder </p>`);
});

app.get("/usuario",(req,res)=>{
    res.send({
        nombre:"pepe",
        apellido:"perez",
        curso:"coder"
    });
});

app.listen(port,()=>console.log(`Server listening on port ${port}`));

