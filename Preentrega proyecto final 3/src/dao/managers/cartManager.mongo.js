import path from "path";
import { __dirname } from "../../utils.js";
import { options } from "../../config/config.js";
import { cartsModel } from "../../models/carts.model.js";
import { productsModel } from "../../models/products.model.js";

export class cartsManagerDb {
    constructor (){
        this.modelCarts = cartsModel;
        this.modelProducts = productsModel;
    }  
/*     AddCart */
async addCart(){
    try {
        const cart ={
            products:[]
        }
        const data = await this.modelCarts.create(cart);
        return data;
    } catch (error) {
        throw new Error(`Error al crear carrito en la BD ${error.message}`);
    }
};
/*     // getProductsByCartId  */
async getCartById(id){
    try {
        const data = await this.modelCarts.findOne({_id:id});
        if(!data){
            throw new Error(`El carrito con el id ${id} no existe`);                
        };
        return data; 
    } catch (error) {
        throw new Error(`Error al obtener el carrito o no existe en la BD`);
    }
};
async getCarts(){
    try {
        const data = await this.modelCarts.find();
        if(!data){
            throw new Error(`No existen carritos`);                
        };
        return data; 
    } catch (error) {
        throw new Error(`Error al obtener los carritos`);
    }
};
/*     // updateProduct  */
async addProductToCart(cartId, productId){
try {
    const carts = await this.modelCarts.findById(cartId);
    if(carts){
        const productIndex = carts.products.findIndex(item=>item.product.id === productId);
        console.log("productindex",productIndex);
       // console.log("cart quantity ",carts.products[productIndex].quantity);
        if(productIndex>=0){
            carts.products[productIndex]={
                product:carts.products[productIndex].product,
                quantity:carts.products[productIndex].quantity+1
            }
            await this.modelCarts.findByIdAndUpdate(cartId,carts,{new:true});
        } else{
            const newCartProduct = {
                product:productId,
                quantity:1
            };
            carts.products.push(newCartProduct);
            console.log(carts);
            await this.modelCarts.findByIdAndUpdate(cartId,carts,{new:true});
        }
        return `Producto agregado al carrito`
    };
    } catch (error) {
        throw new Error(error.message);
    }
};
//Borrar producto de carrito
async deleteProductFromCart(cartId, productId){
    try {
        const carts = await this.modelCarts.findById(cartId);        
        if(carts){
            const lookId = JSON.parse(JSON.stringify(productId));
            const productIndex = carts.products.findIndex(item=>item.product.id === lookId);
           // console.log("cart quantity ",carts.products[productIndex].quantity);
            if(productIndex>=0){
                await carts.products.splice(productIndex,1);
                await this.modelCarts.findByIdAndUpdate(cartId,carts,{new:true});                
            } else{
                console.log("Producto no existe en carrito");
                return `Producto no existe en el carrito`
            }
            return `Producto eliminado del carrito`
        };
        } catch (error) {
            throw new Error(error.message);
        }
    };
//cambiar cantidad de producto en carrito
async changeProductQuantity(cartId, productId, productQuantity){
    try {
        const carts = await this.modelCarts.findById(cartId);
        console.log("product quantity",productQuantity)
        if(carts){
            const productIndex = carts.products.findIndex(item=>item.product.id === productId);
            console.log("productindex",productIndex);
           // console.log("cart quantity ",carts.products[productIndex].quantity);
            if(productIndex>=0){
                carts.products[productIndex]={
                    product:carts.products[productIndex].product,
                    quantity:productQuantity
                }
                await this.modelCarts.findByIdAndUpdate(cartId,carts,{new:true});
                console.log("carts", carts)
            } else{
                return `Producto no existe en el carrito, no se puede modificar cantidad` 
            }
            return `Cantidad de Producto modificado a ${productQuantity}`
        };
        } catch (error) {
            throw new Error(error.message);
        }
    };
async addProductToCartArray(cartId,productId,productQuantity){
    try {
        const carts = await this.modelCarts.findById(cartId);
        if(carts){
            const productIndex = carts.products.findIndex(item=>item.product.id === productId);
            console.log("productindex",productIndex);
            // console.log("cart quantity ",carts.products[productIndex].quantity);
            if(productIndex>=0){
                throw new Error (`Producto ya existente en el carrito, error por intentar duplicar producto`)
            } else{
                const newCartProduct = {
                    product:productId,
                    quantity:productQuantity
                };
                carts.products.push(newCartProduct);
                console.log(carts);
                await this.modelCarts.findByIdAndUpdate(cartId,carts,{new:true});
            }
            return `Producto agregado al carrito`
        };
        } catch (error) {
            throw new Error(error.message);
        }
    };
//Vaciar carrito
async emptyCart(cartId){
    try {
        const carts = await this.modelCarts.findById(cartId);
        const arrayLength = carts.products.length
        if(carts){
            if(arrayLength>0){
                await carts.products.splice(0,arrayLength);
                await this.modelCarts.findByIdAndUpdate(cartId,carts,{new:true});                
            } else{
                console.log("Carrito vacio");
                return `Carrito vacio`
            }
            return `Carrito vaciado`
        };
        } catch (error) {
            throw new Error(error.message);
        }
    };
//Fin de la clase
}
