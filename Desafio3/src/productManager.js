import fs  from "fs";
import path from "path";
import { __dirname } from "./utils.js";

 class ProductManager {
    constructor(pathName){
        this.path = path.join(__dirname,`/${pathName}`);
    }
/*     FileExists Verificando archivo  */
    fileExists(){
        return fs.existsSync(this.path);
    }
/*     Generando Id Automatico  */
    generateId(products){
        try {
            let newId;
            if(!products.length){
                newId=1;
            } else{
                newId=products[products.length-1].id+1;
            }
            return newId;
        } catch (error) {
            return Error(`Error al generar ID de producto ${error.message}`)
        }

    }

/*     AddProduct  */
    async addProduct(product){
    
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                const productId = this.generateId(products);
                product.id = productId;
                //Construccion de objeto
                const product ={
                title:title,
                description:description,
                price:price,
                thumbnail:thumbnail,
                code:productId,
                stock:stock
                    };
                    //Validación de info
                    if(!title||!description||!price||!thumbnail||!stock){
                        return console.log("Falta información");
                    }else{
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
            return Error(`Error al añadir el producto ${error.message}`);
        }
    };

/*    GetProducts  */
    async getProducts(){
        try {
            if(this.fileExists()){
                
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                // console.log("allProducts: ",products); 
                // console.log(content);
                return products;               
            }
            else{
                return Error("El archivo no existe")
            }
        } catch (error) {
            return Error(`Error al obtener los productos ${error.message}`);
        }
    };

/*     // getProductsById  */
    async getProductsById(id){
            try {
                if(this.fileExists()){
                    const content = await fs.promises.readFile(this.path,"utf-8");
                    const products = JSON.parse(content);
                    const findProduct = products.find(item=>item.id === id);
                    if(findProduct){
                        return findProduct;
                    } else {
                        return Error(`El producto con el id ${id} no existe`);
                    }
                }
                else{
                    return Error("El archivo no existe")
                }
            } catch (error) {
                return Error(`Error al obtener producto por ID ${error.message}`);
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
                    return Error(`El producto con el id ${id} no existe`);
                }
            }
            else{
                return Error("El archivo no existe")
            }
        } catch (error) {
            return Error(`Error al eliminar el producto del registro ${error.message}`);
        }
    };

    /*     // updateProduct  */
    async updateProduct(id, product){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                const findProductIndex = products.findIndex(item=>item.id === id);
                if(findProductIndex>=0){
                    products[findProductIndex]= {
                        ...products[findProductIndex],
                        ...product
                    };
                    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                    return `El producto con el id ${id} fue modificado`;
                } else {
                    return Error(`El producto con el id ${id} no existe`);
                }
            }
            else{
                return Error("El archivo no existe")
            }
        } catch (error) {
            return Error(`No se pudieron guardar los cambios en el producto ${error.message}`);
        }
    };
}

export {ProductManager};
