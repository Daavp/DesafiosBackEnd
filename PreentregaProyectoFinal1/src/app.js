import express from "express";
import { __dirname } from "./utils.js"; //Ubicación __dirname
import path from "path"; //Para unir rutas sería path.join(__dirname,"/ruta1/ruta2/ruta...") Se concatenan las rutas

//Routers
import { routerProducts } from "./routes/products.routes.js";
import { routerCart } from "./routes/cart.routes.js";

const app = express();
const port = 8080;


// Middlewares de Aplicacion
app.use(express.json()); //Interpretar POST JSON
app.use(express.urlencoded({extended:true}));

//Routes products
app.use("/api/products",routerProducts);

//Routes carts
app.use("/api/carts",routerCart);


app.listen(port,()=>console.log(`Server listening on port ${port}`));