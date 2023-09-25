import { cartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { PaymentService } from "../services/payment.service.js";
import { logger } from "../utils/logger.js";
import { options } from "../config/config.js";
import Stripe from "stripe";


import {v4 as uuidv4} from 'uuid';

export class paymentController{
//importar servicio de carrito, leer carrito del usuario para tener los productos y procesar el pago
    static async paymentIntentProductsCart(req,res){
        try {
            let myuuid = uuidv4();
            const cartId = req.user.cart;
            const data = await cartsService.getCartById(cartId);
            if (data){
                logger.debug("Carrito existe puede comprar");
               const productsAproved =[];
               const productsRejected =[];
               const line_items = []
        
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
                    };
                    if(productDB.stock>= productIdCart.quantity){
                        line_items.push({
                            price_data:{
                                product_data:{
                                    name:productIdCart.product.title,
                                    description:productDB.description
                                },
                                currency:'usd',
                                unit_amount:productDB.price 
                        },
                        quantity:productIdCart.quantity
                            }
                        );
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
        
                logger.debug("Total amount: ",totalAmount);
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
               };
               logger.http("data client info",clientPageInfo);
               logger.http("requser",req.user);
               logger.http("prodAp",productsAproved);
        
               //generar informacion de la compra
               console.log("Line items ",line_items);

            const stripe = new Stripe(options.stripe.secretStripeBack);
               const session = await stripe.checkout.sessions.create({
                line_items:line_items,
                mode:'payment',
                success_url:`${options.stripe.siteDomain}/carts/${cartId}/purchaseConfirmation?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url:`${options.stripe.siteDomain}/api/payments/order/error`
               });
            return res.json(session)
                
            };
        
        
            } catch (error) {
                return res.json ({error:"Error al comprar stripe", message:error.message})
            }
            };
        }