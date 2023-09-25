import Stripe from "stripe";
import { options } from "../config/config.js";

export class PaymentService{
    constructor(){
        this.clientStripe = new Stripe(options.stripe.secretStripeBack);
    };
    async createPaymentIntent(paymentInfo){
        const paymentIntent = this.clientStripe.paymentIntents.create({
            line_items:paymentInfo,
            mode: 'payment',
            success_url:`${options.stripe.siteDomain}/api/payments/order/success`,
            cancel_url:`${options.stripe.siteDomain}/api/payments/order/error`
        });
        console.log("paymentintenturl", paymentIntent.url)
/*         res.redirect(303, session.url); */

        return paymentIntent;
    }
}