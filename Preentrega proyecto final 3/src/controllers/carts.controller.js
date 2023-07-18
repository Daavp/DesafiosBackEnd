//importar servicio de productos y carrito
import { cartsService } from "../services/carts.service.js";
import { connectDB } from "../config/dbConnection.js";
import { ProductsService } from "../services/products.service.js"; 

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
}