//importar servicio de productos
import { cartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { chatMongo } from "../dao/managers/chatMongo.js"; 
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
            console.log("requser profile",req.user);
           return res.render("profile",req.user);
        } else {
            res.redirect("/login")
        }
    };
}