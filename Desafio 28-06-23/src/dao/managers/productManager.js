import fs  from "fs";
import path from "path";
import { __dirname } from "../../utils.js";
import { options } from "../../config/config.js";

 class ProductManager {
    constructor(pathName){
        this.path = path.join(__dirname,`/dao/files/${options.filesystem.products}`);
    }
/*     FileExists Verificando archivo  */
    fileExists(){
        return fs.existsSync(this.path);
    }
/*     Generando Id Automatico  */
    generateId(products){
        let newId;
        if(!products.length){
            newId=1;
        } else{
            newId=products[products.length-1].id+1;
        }
        return newId;
    }

/*     AddProduct  */
    async addProduct(product){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                const productId = this.generateId(products);
                const findProductCode = products.findIndex(item=>item.code === product.code);
                product.id = productId;                

                    //Validación de info
                if(findProductCode>=0){//primera verificación de que el codigo este libre, si no da error
                    throw new Error(`No se puede crear producto con el codigo ${product.code}, el codigo ya lo está utilizando otro producto `);
}
                // title:title,   // description:description,   // code:productId,   // price:price,   // status   // stock:stock   // category   // thumbnails:thumbnails,
                    else if(!product.title||!product.description||!product.code||!product.price||!product.status||!product.stock||!product.category){
                       throw new Error(error.message);
                    }
                    else{
                products.push(product);
                // console.log("Product: ",product); Prueba de que funciona y muestra producto
                await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                return product;}
            }
            else{
                const productId = this.generateId([]);
                product.id = productId;
                // console.log("Product: ",product);
                await fs.promises.writeFile(this.path,JSON.stringify([product],null,2));
                return product;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

/*    GetProducts  */
    async getProducts(){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                return products;               
            }
            else{
                throw new Error("El archivo no existe")
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

/*     // getProductsById  */
    async getProductsById(id){
            try {
                if(this.fileExists()){
                    const content = await fs.promises.readFile(this.path,"utf-8");
                    const products = JSON.parse(content);
                    const findProduct = products.find(item=>item.id === parseInt(id));
                    if(findProduct){
                        return findProduct;
                    } else {
                        throw new Error(`El producto con el id ${id} no existe`);
                    }
                }
                else{
                    throw new Error("El archivo no existe")
                }
            } catch (error) {
                throw new Error(error.message);
            }
        };

/*     // deleteProduct  */
    async deleteProduct(id){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                const findProductIndex = products.findIndex(item=>item.id === id);

                if(findProductIndex>=0){
                    // products[findProductIndex]= { ...products[findProductIndex]};
                    const allExeptIndex = products.filter(items => items.id > findProductIndex+1 || items.id < findProductIndex+1); // return implicito
                    console.log(allExeptIndex);

                    await fs.promises.writeFile(this.path,JSON.stringify(allExeptIndex,null,2));
                    return `El producto con el id ${id} fue eliminado`;

                } else {
                    throw new Error(`El producto con el id ${id} no existe o fue eliminado`);
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
    async updateProduct(id, product){
        try {
            if(this.fileExists()){
                
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);

                const findProductIndex = products.findIndex(item=>item.id === id);
                console.log (findProductIndex);
                if(findProductIndex >=0){ //Corrección para que encuentre o de error si no lo encuentra
                    products[findProductIndex]= {
                        ...products[findProductIndex],
                        ...product
                    };
                    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                    return `El producto con el id ${id} fue modificado`;
                } else {
                    throw new Error(`El producto no se puede modificar, el id ${id} no existe`);
                }
            }
            else{
                throw new Error("El archivo no existe")
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };
};

export {ProductManager};
