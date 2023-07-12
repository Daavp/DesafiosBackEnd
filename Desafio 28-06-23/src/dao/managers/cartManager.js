import fs  from "fs";
import path from "path";
import { __dirname } from "../../utils.js";
import { options } from "../../config/config.js";

 class CartManager {
    constructor(pathName){
        this.path = path.join(__dirname,`/dao/files/${options.filesystem.carts}`);
    }
/*     FileExists Verificando archivo  */
    fileExists(){
        return fs.existsSync(this.path);
    }
/*     Generando Id Automatico  */
    generateId(carts){
        let newId;
        if(!carts.length){
            newId=1;
        } else{
            newId=carts[carts.length-1].id+1;
        }
        return newId;
    }

/*     AddCart */
    async addCart(){
        try {
            const cart ={
                products:[]
            }
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const carts = JSON.parse(content);
                const cartId = this.generateId(carts);
                cart.id = cartId;
                
                carts.push(cart);
                // console.log("Product: ",product); Prueba de que funciona y muestra producto
                await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2));
                return cart;
            }
            else{
                const cartId = this.generateId([]);
                cart.id = cartId;
                // console.log("Product: ",product);
                await fs.promises.writeFile(this.path,JSON.stringify([cart],null,2));
                return cart;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

/*     // getProductsByCartId  */
    async getCartById(id){
            try {
                if(this.fileExists()){
                    const content = await fs.promises.readFile(this.path,"utf-8");
                    const carts = JSON.parse(content);
                    const cartId = parseInt(id);
                    const findCart = carts.find(item=>item.id === cartId);
                    if(findCart){
                        return findCart;
                    } else {
                        throw new Error(`El carrito con el id ${id} no existe`);
                    }
                }
                else{
                    throw new Error("El archivo no existe")
                }
            } catch (error) {
                throw new Error(error.message);
            }
        };


    /*     // updateProduct  */
    async addProductToCart(cartId, productId){
        try {
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
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };
};

export {CartManager};