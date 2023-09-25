import express from "express";
import handlebars from "express-handlebars";
import path from "path"; //Para unir rutas sería path.join(__dirname,"/ruta1/ruta2/ruta...") Se concatenan las rutas
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import cors from "cors";
import { logger } from "./utils/logger.js";
import { swaggerSpecs } from "./config/swaggerConfig.js";
import swaggerUI from "swagger-ui-express";

import { __dirname } from "./utils.js"; //Ubicación __dirname
import {Server} from "socket.io";
import { viewsRouter } from "./routes/views.routes.js"; 
import { options } from "./config/config.js";
import { userRouter } from "./routes/users.routes.js";

//Routers
import { routerProducts } from "./routes/products.routes.js";
import { routerCart } from "./routes/cart.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { productManagerDb } from "./dao/managers/productManager.mongo.js";
import { chatMongo } from "./dao/managers/chatMongo.js";
import { mockingproductsRouter } from "./routes/mockingproducts.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
//const manager = new ProductManager("products.json"); FS
const manager = new productManagerDb();
const chatService = new chatMongo();

//Configuracion del servidor HTTP
const app = express();
//Middlewares
app.use(express.static(path.join(__dirname,"/public")));
//Servidor HTTP
const httpServer = app.listen(options.server.port,()=>logger.info(`Server listening on port ${options.server.port}`));
logger.info(`Enviroment actual es: ${options.server.appEnv}`);
//configuración de la session
app.use(session({
    store: mongoStore.create({
        mongoUrl:options.mongo.url
    }),
    secret:options.server.secretSession,
    resave:true,
    saveUninitialized:true
}));
//Configuracion Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Servidor de webSocket
const socketServer = new Server (httpServer);

//configuracion del motor de plantillas

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

// Middlewares de Aplicacion
app.use(express.json()); //Interpretar POST JSON
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(errorHandler);
//Routes products
app.use("/api/products",routerProducts);
//Routes carts
app.use("/api/carts",routerCart);
//Routes Views
app.use("/",viewsRouter);
//Routes Sessions
app.use("/api/sessions", authRouter);
//Mocking products
app.use("/mockingproducts",mockingproductsRouter);
//Routes users
app.use("/api/users",userRouter);
//Ruta donde se va a ver la documentación de endpoints
app.use("/documentation",swaggerUI.serve,swaggerUI.setup(swaggerSpecs));
//Ruta payments stripe
app.use("/api/payments", paymentRouter);

socketServer.on("connection", async (socket)=>{
    // console.log(`nuevo socket cliente conectado ${socket.id}`);
    const allProducts = await manager.getProducts();//await manager.getProducts();
    const messages = await chatService.getMessages();
    socketServer.emit("wellcomeMsg", `Cliente conectado en socket: ${socket.id}`);
    socketServer.emit("allProductsServer",allProducts);//Aqui entrego lo que quiero con emit  
    socketServer.emit("msgHistory", messages);

    //recibir mensajes
    socket.on("message", async(data)=>{
        await chatService.addMessage(data);
        const messages = await chatService.getMessages();
        socketServer.emit("msgHistory", messages);

    });
    
    
});

/*cada vez que se conecte un cliente llamar manager,
obtener productos y emitir evento con productos para el cliente.
productos se reciben a traves de archivo js que este vinculado a la vista

*/