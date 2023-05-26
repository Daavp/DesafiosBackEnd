import path from "path";
import { __dirname } from "../../utils.js";
import { options } from "../../config/options.js";
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
            const data = await this.modelCarts.findById(id);
            if(!data){
                throw new Error(`El carrito con el id ${id} no existe`);                
            };
            return data;
        } catch (error) {
            throw new Error(`Error al obtener el carrito o no existe en la BD`);
        }
    };


/*     // updateProduct  */
async addProductToCart(cartId, productId){
    try {
        const carts = await this.modelCarts.findById(cartId);
        if(carts){
            const productIndex = carts.products.findIndex(item=>item.product === productId);
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

 /*        const findProduct = await this.modelProducts.findById({product:productId});
        console.log(findProduct);

        if(this.fileExists()){
            const content = await fs.promises.readFile(this.path,"utf-8");
            const carts = JSON.parse(content);
            const cartIndex = carts.findIndex (item=>item.id === parseInt(cartId));
            if(cartIndex>=0){
                const productIndex = carts[cartIndex].products.findIndex(item=>item.product === parseInt(productId));
                if(productIndex>=0){
                    carts[cartIndex].products[productIndex]={
                        product:carts[cartIndex].products[productIndex].product,
                        quantity:carts[cartIndex].products[productIndex].quantity+1
                    }
                    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2));
                } else{
                    const newCartProduct = {
                        product:parseInt(productId),
                        quantity:1
                    }
                    carts[cartIndex].products.push(newCartProduct);
                    await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2));
                }
                return `Producto agregado al carrito`
            }else{
                throw new Error(`El carrito no existe`);
            };
        }
        else{
            throw new Error("El archivo no existe")
        } */
    } catch (error) {
        throw new Error(error.message);
    }
};
}
