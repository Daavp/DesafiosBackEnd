//importar servicio de productos y carrito
import { cartsService } from "../services/carts.service.js";
import { connectDB } from "../config/dbConnection.js";
import { ProductsService } from "../services/products.service.js"; 
import { ticketsService } from "../services/tickets.service.js";
import {v4 as uuidv4} from 'uuid';
let myuuid = uuidv4();

export class CartsController{
    static async getCarts(req,res){
        try {
            const cart= await cartsService.getCarts();
            if(cart){
                res.json({status:"success", data:cart }); //Mensaje de carrito encontrado
            } else {
                res.status(400).json({status:"error", message:"No hay carritos"});
            }
            
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    };
    static async addCart(req,res){
        try {
            const cartCreated = await cartsService.addCart();
            res.json({status:"success", data:cartCreated }); //Mensaje de exito de carrito creado
        } catch (error) {
            res.status(500).send({status:"error", message:error.message});
        }
    };
    static async getCartById(req,res){
        try {
            const cartId = req.params.cid;
            const cart= await cartsService.getCartById(cartId);
            if(cart){
                res.json({status:"success", data:cart }); //Mensaje de carrito encontrado
            } else {
                res.status(400).json({status:"error", message:"Carrito no existe"});
            }
            
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    };
    static async addProductToCart(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const cart= await cartsService.getCartById(cartId);
            if(cart){
                const product = await ProductsService.getProductById(productId);
                if(product){
                    const response = await cartsService.addProductToCart(cartId,productId);
                    connectDB();
                    res.json({status:"success",message:response});
                }else {
                    res.status(400).json({status:"error", message:"Producto solicitado no existe"});
                }
            } else {
                res.status(400).json({status:"error", message:"Carrito no existe"});
            }
            
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    };
    static async deleteProductFromCart(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const cart= await cartsService.getCartById(cartId);
            if(cart){
                const product = await ProductsService.getProductById(productId);
                if(product){
                    const response = await cartsService.deleteProductFromCart(cartId,productId);
                    connectDB();
                    res.json({status:"success",message:response});
                }else {
                    res.status(400).json({status:"error", message:"No existe ID de producto en la BD"});
                }
            } else {
                res.status(400).json({status:"error", message:"Carrito no existe"});
            }
            
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    };
    static async addProductToCartArray(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.body.product;
            const productQuantity = req.body.quantity;
            const cart= await cartsService.getCartById(cartId);
            if(cart){
                const product = await ProductsService.getProductById(productId);
                if(product){
                    const response = await cartsService.addProductToCartArray(cartId,productId,productQuantity);
                    connectDB();
                    res.json({status:"success",message:response});
                }else {
                    res.status(400).json({status:"error", message:"Producto solicitado no existe"});
                }
            } else {
                res.status(400).json({status:"error", message:"Carrito no existe"});
            }
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    };
    static async changeProductQuantity(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const productQuantity = req.body.quantity;
            const cart= await cartsService.getCartById(cartId);
            if(cart){
                const product = await ProductsService.getProductById(productId);
                if(product){
                    const response = await cartsService.changeProductQuantity(cartId,productId,productQuantity);
                    connectDB();
                    res.json({status:"success",message:response});
                }else {
                    res.status(400).json({status:"error", message:"Producto solicitado no existe"});
                }
            } else {
                res.status(400).json({status:"error", message:"Carrito no existe"});
            }
            
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    };
    static async emptyCart(req,res){
        try {
            const cartId = req.params.cid;
            const cart= await cartsService.getCartById(cartId);
            if(cart){
                const response = await cartsService.emptyCart(cartId);
                connectDB();
                res.json({status:"success",message:response});
            } else {
                res.status(400).json({status:"error", message:"Carrito no existe"});
            }
            
        } catch (error) {
            res.status(500).json({status:"error", message:error.message});
        }
    };
    static async purchase(req,res){
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
                            product:productIdCart.product._id,
                            quantity:productIdCart.quantity,
                            price:productDB.price
                        });
                        const newStock = parseInt(productDB.stock) - productIdCart.quantity;
                        console.log(newStock);
                    }
                    if(productDB.stock< productIdCart.quantity){
                        productsRejected.push({
                            product:productIdCart.product._id,
                            stock:productDB.stock
                        })};
               };
               var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = dd + '/' + mm + '/' + yyyy;

               console.log("productsAproved ", productsAproved);
               console.log("productsRejected ", productsRejected);

               let totalAmount = productsAproved.reduce((acum,act) => acum + act.price,0);

               console.log(totalAmount)

               const ticketInfo = {
                code:myuuid,
                purchaseDatetime:today,
                products:{
                    productsAproved
                },
                amount:totalAmount,
                purchaser:await req.body.email
               }
               console.log("data ",ticketInfo)

               res.json({status:success, message:"ticket creado", data:ticketInfo})
            };
            
            

        } catch (error) {
            
        }
    };
}