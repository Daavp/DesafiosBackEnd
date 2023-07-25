//Importar persistencia (Manager) de la Factory
import { cartsDao } from "../dao/factory.js";
const cartManager = cartsDao;

export class cartsService{
    static async getCarts(){
        const result = cartManager.getCarts();
        return result;
    };
    static async addCart(){
        const result = cartManager.addCart();
        return result;
    };
    static async getCartById(id){
        const result = cartManager.getCartById(id);
        return result;
    };
    static async addProductToCart(cartId, productId){
        const result = cartManager.addProductToCart(cartId, productId);
        return result;
    };
    static async deleteProductFromCart(cartId, productId){
        const result = cartManager.deleteProductFromCart(cartId, productId);
        return result;
    };
    static async changeProductQuantity(cartId, productId, productQuantity){
        const result = cartManager.changeProductQuantity(cartId, productId, productQuantity);
        return result;
    };
    static async addProductToCartArray(cartId,productId,productQuantity){
        const result = cartManager.addProductToCartArray(cartId,productId,productQuantity);
        return result;
    };
    static async emptyCart(cartId){
        const result = cartManager.emptyCart(cartId);
        return result;
    };
}