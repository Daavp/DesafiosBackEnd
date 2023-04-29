import express from "express";
import { __dirname } from "./utils.js"; //Ubicación __dirname
import path from "path"; //Para unir rutas sería path.join(__dirname,"/ruta1/ruta2/ruta...") Se concatenan las rutas
import {Server} from "socket.io";
import handlebars from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";

//Routers
import { routerProducts } from "./routes/products.routes.js";
import { routerCart } from "./routes/cart.routes.js";
import { ProductManager } from "./managers/productManager.js";
const manager = new ProductManager("products.json");

//Configuracion del servidor HTTP
const app = express();
const port = 8080;
//Middlewares
app.use(express.static(path.join(__dirname,"/public")));
//Servidor HTTP
const httpServer = app.listen(port,()=>console.log(`Server listening on port ${port}`));

//Servidor de webSocket
const socketServer = new Server (httpServer);

//configuracion del motor de plantillas

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

// Middlewares de Aplicacion
app.use(express.json()); //Interpretar POST JSON
app.use(express.urlencoded({extended:true}));

//Routes products
app.use("/api/products",routerProducts);

//Routes carts
app.use("/api/carts",routerCart);

//Routes Views
app.use("/",viewsRouter);

const allProducts = await manager.getProducts();
socketServer.on("connection",(socket)=>{
    // console.log(`nuevo socket cliente conectado ${socket.id}`);
    socketServer.emit("wellcomeMsg", `Cliente conectado en socket: ${socket.id}`);
    socketServer.emit("allProductsServer",allProducts);//Aqui entrego lo que quiero con emit
})

/*cada vez que se conecte un cliente llamar manager,
obtener productos y emitir evento con productos para el cliente.
productos se reciben a traves de archivo js que este vinculado a la vista

*/