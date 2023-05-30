import { Router } from "express";
import { ProductManager } from "../dao/managers/productManager.js";
import { productManagerDb } from "../dao/managers/productManager.mongo.js";
import { cartsManagerDb } from "../dao/managers/cartManager.mongo.js";
import { options } from "../config/options.js";
import { chatMongo } from "../dao/managers/chatMongo.js";

const manager = new productManagerDb();
const cartManager = new cartsManagerDb();
const chatService = new chatMongo();
const router = Router();

//Endpoints
//Render de productos

router.get("/",async (req,res)=>{
    try {
        const allProducts = await manager.getProducts();
        res.render("home",{allProducts}); //Aqui mostrar todos los productos del archivo
    } catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});

//Productos en tiempo real
router.get("/realTimeProducts", async (req,res)=>{
    try {
        const allProducts = await manager.getProducts();
        res.render("realTimeProducts",{allProducts}); //Aqui mostrar todos los productos del archivo
    } catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});

//Render de chat
router.get("/chat",async (req,res)=>{
try {
    const allMessages = await chatService.getMessages();
    res.render("chat"),{allMessages};
    console.log ("En el try del render chat");
    } catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});

//render productos con botones
router.get("/products",async(req,res)=>{
    try {
        const {limit =10, page=1, sort, category, stock} = req.query;
        if([!"asc","desc"].includes(sort)){
            return res.json({status:"error", message:"Ordenamiento no valido, ingresar asc o desc"})
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        let query = {};
            if(category && stock){
                query = {category: category, stock: stockValue}
            } else{
                if(category|| stockValue){
                    if (category){
                        query ={category:category}
                    }else{
                        query ={stock:stockValue}
                    }
                }
            };
/*            console.log("limit",limit,"page",page,"sortvalue",sortValue,"category",category,"stock",stockValue) 
           console.log("query",query); */
           const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
            const result = await manager.getPaginate(query, {
                page,
                limit,
                sort:{price:sortValue},
                lean:true
            });
            console.log("result",result);
            const response ={
                status: "success",
                payload:result.docs,
                totalPages:result.totalPages,
                totalDocs:result.totalDocs,
                prevPage:result.prevPage,
                nextPage:result.nextPage,
                page:result.page,
                hasPrevPage:result.hasPrevPage,
                hasNextPage:result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl.replace(`page=${result.page}`,`page=${result.prevPage}`)}` : null,
                nextLink: result.hasNextPage ? `${baseUrl.replace(`page=${result.page}`,`page=${result.nextPage}`)}` : null,
            };
            console.log("response",response);
            res.render("products",response);
    } catch (error) {
        return res.status(500).send({status:"Error al obtener los productos"});
    }
});
router.get("/carts/:cid",async(req,res)=>{
    
    try {
        const data = await cartManager.getCartById(req.params.cid);
        console.log("data", data.products);
        const productsLength = data.products.length;
        const cartProducts = data.products;
        const response = {
            cartId:data._id,
            totalProducts:productsLength,
            cartProducts:cartProducts
        }
        
            console.log("response",response);
            res.render("carts",response);
    } catch (error) {
        return res.status(500).send({status:"Error al obtener los productos del carrito BD"});
    }
});
router.get("/products/:pid",async (req,res)=>{ //BUSQUEDA ID PARAMS MONGO
    try {
        const data = await manager.getProductById(req.params.pid);
        if(!data){ //Si no lo encuentra da mensaje
            return res.send(`Producto con el id ${req.params.pid} no existe, intenta con otro ID.`)
        };
        console.log("response",data);
        res.render("productDetail",data);
    }
     catch (error) {
        res.status(500).send({status:"Error al obtener los productos"});
    }
});
export {router as viewsRouter};