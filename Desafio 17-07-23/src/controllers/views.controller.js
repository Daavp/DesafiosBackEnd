//importar servicio de productos
import { cartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { ticketsService } from "../services/tickets.service.js";
import { chatMongo } from "../dao/managers/chatMongo.js"; 
import {v4 as uuidv4} from 'uuid';
import { response } from "express";

const chatService = new chatMongo();

export class ViewsController{
    static async viewsHome(req,res){
        try {
            const data = await ProductsService.getAllProducts();
            /* console.log(data) */
             const response = {
                allProducts:data
              }; 
            res.render('home',response); //Aqui mostrar todos los productos del archivo
        } catch (error) {
            console.log(error.message);
            res.status(500).send({status:"Error al obtener los productos"});
        }
    };
    static async viewsRealTimeProducts(req,res){
        try {
            const allProducts = await ProductsService.getAllProducts();
            res.render("realTimeProducts",{allProducts}); //Aqui mostrar todos los productos del archivo
        } catch (error) {
            res.status(500).send({status:"Error al obtener los productos"});
        }
    };
    static async viewsChat(req,res){
        try {
            const allMessages = await chatService.getMessages();
            const userData = req.user;
            res.render("chat"),{allMessages,userData};
            console.log ("En el try del render chat", userData);
            } catch (error) {
                res.status(500).send({status:"Error al obtener los mensajes"});
            }
    };
    static async viewsProducts(req,res){
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
                const result = await ProductsService.getProducts(query, {
                    page,
                    limit,
                    sort:{price:sortValue},
                    lean:true
                });
                const userData = req.user; 
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
                    userData:userData
    
                };
                
                 console.log("response usuario",response.userData); 
                res.render("products",response);
        } catch (error) {
            return res.status(500).send({status:"Error al obtener los productos"});
        }
    };
    static async viewsCartById(req,res){
        try {
            const data = await cartsService.getCartById(req.params.cid);
            const products = [];
            data.products.map((product) => {
              products.push({
                id: product.product._id,
                title: product.product.title,
                description: product.product.description,
                quantity: product.quantity,
                price: product.product.price,
                category: product.product.category,
              });
            });
            const response = {
                cartId: data._id,
                totalProducts: data.products.length,
                cartProducts: products,
              };
              res.render('carts', response);
            } catch (error) {
              return res
                .status(500)
                .send({ status: 'Error al obtener los productos del carrito BD' });
            }
    };
    static async viewsProductById(req,res){
        try {
            const data = await ProductsService.getProductById(req.params.pid);
            if(!data){ //Si no lo encuentra da mensaje
                return res.send(`Producto con el id ${req.params.pid} no existe, intenta con otro ID.`)
            };
            const response = {
                _id: data._id,
                title: data.title,
                description: data.description,
                code: data.code,
                price: data.price,
                category:data.category,
                userData:req.user
              };
            console.log("response",response);
            res.render("productDetail",response);
        }
         catch (error) {
            res.status(500).send({status:"Error al obtener los productos"});
        }
    };
    static async viewsLogin(req,res){
        res.render("login");
    };
    static async viewsSignup(req,res){
        res.render("signup");
    };
    static async viewsProfile(req,res){
        if(req.user){
           return res.render("profile",req.user);
        } else {
            res.redirect("/login")
        }
    };
    static async purchaseView(req,res){
        try {
            const cartId = req.params.cid;
            const data = await cartsService.getCartById(cartId);
            if (data){
            console.log("Carrito existe");
               const productsAproved =[];
               const productsRejected =[];

               for(let i=0;i<data.products.length;i++){
                   const productIdCart = data.products[i];
                   const productDB = await ProductsService.getProductById(data.products[i].product._id);

                    if(productDB.stock>= productIdCart.quantity){
                        productsAproved.push({
                            productId:productIdCart.product._id,
                            product:productIdCart.product.title,
                            quantity:productIdCart.quantity,
                            price:productDB.price,
                            pricexquantity:productDB.price*productIdCart.quantity
                        });
                        const newStock = parseInt(productDB.stock) - productIdCart.quantity;
                        console.log(newStock);
                    }
                    if(productDB.stock< productIdCart.quantity){
                        productsRejected.push({
                            productId:productIdCart.product._id,
                            product:productIdCart.product.title,
                            stock:productDB.stock
                        })};
               };

               console.log("productsAproved ", productsAproved);
               console.log("productsRejected ", productsRejected);

               let totalAmount = productsAproved.reduce((acum,act) => acum + act.pricexquantity,0);

               const clientPageInfo ={
                myCart:cartId,
                products:{
                    productsAproved
                },
                amount:totalAmount,
                productsRejected:{
                    productsRejected
                }
               };
               console.log("data client info",clientPageInfo);
               console.log("prodAp",productsAproved.length)

               return res.render("purchase",clientPageInfo)
            };
            
            

        } catch (error) {
            return res
            .status(500)
            .send({ message: 'Error al generar el ticket' });
        }
    };
    static async purchaseConfirmationView(req,res){
        try {
            let myuuid = uuidv4();
            const cartId = req.params.cid;
            const data = await cartsService.getCartById(cartId);
            if (data){
            console.log("Carrito existe");
               const productsAproved =[];
               const productsRejected =[];

               for(let i=0;i<data.products.length;i++){
                   const productIdCart = data.products[i];
                   const productDB = await ProductsService.getProductById(data.products[i].product._id);

                    if(productDB.stock>= productIdCart.quantity){
                        productsAproved.push({
                            productId:productIdCart.product._id,
                            product:productIdCart.product.title,
                            quantity:productIdCart.quantity,
                            price:productDB.price,
                            pricexquantity:productDB.price*productIdCart.quantity
                        });
                        const newStock = parseInt(productDB.stock) - productIdCart.quantity;
                        console.log(newStock);
                    }
                    if(productDB.stock< productIdCart.quantity){
                        productsRejected.push({
                            productId:productIdCart.product._id,
                            product:productIdCart.product.title,
                            stock:productDB.stock
                        })};
               };
               var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = dd + '/' + mm + '/' + yyyy;

                let totalAmount = productsAproved.reduce((acum,act) => acum + act.pricexquantity,0);

               console.log(totalAmount)

               const ticketInfo = {
                code:myuuid,
                purchaseDatetime:today,
                products:{
                    productsAproved
                },
                amount:totalAmount,
                purchaser:await req.user.email
               };
               const clientPageInfo ={
                myCart:cartId,
                ...ticketInfo,
                productsRejected:{
                    productsRejected
                }
               };
               console.log("data client info",clientPageInfo);
               console.log("requser",req.user);
               console.log("prodAp",productsAproved);

               const orderConfirmed = await ticketsService.createTicket(ticketInfo);
               console.log("OrderConfirmed ",orderConfirmed);

               //Borrar productos aprobados del carrito
               for(let i=0;i<productsAproved.length;i++){
                const productIdCart = productsAproved[i];
               // console.log("borrando productos", await ProductsService.getProductById(productIdCart.productId));

                const productDB = await cartsService.deleteProductFromCart(cartId,productIdCart.productId);
                console.log("FuncDelete", productDB);


            };
                //Render
               return res.render("purchaseConfirmation",clientPageInfo)
            };
            
            

        } catch (error) {
            return res
            .status(500)
            .send({ message:error.message });
        }
    };
    static async getUserTickets(req,res){
        try {
            const data = await ticketsService.getUserTickets(req.user.email);
            if(!data){ //Si no lo encuentra da mensaje
                return res.send(`Aun no tienes ordenes ingresadas`)
            };
            const response = {ticket:data};
            console.log("response",response);
            res.render("userTickets",response);//Si lo encuentra entrega el producto
        }
         catch (error) {
            res.status(500).send({status:"Error al obtener datos"});
        }
};
}