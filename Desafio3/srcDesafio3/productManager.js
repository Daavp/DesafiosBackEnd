import fs  from "fs";

 class ProductManager {
    constructor(pathName){
        this.path = pathName;
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
    async addProduct(title,description,price,thumbnail,stock){
    
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
            throw new Error(error.message);
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
                    const findProduct = products.find(item=>item.id === id);
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
}
/* // Utilizar la clase */
// const manager = new ProductManager("./products.json");

// const principalFunction =async ()=> {
//     try {
/*         Producto Prueba agregado */

//         // const addedProduct = await manager.addProduct({
//         //     title:"producto prueba 2",
//         //     description:"Este es un producto prueba",
//         //     price:"200",
//         //     thumbnail:"Sin imagen",
//         //     code:"abc123",
//         //     stock:"25"
//         // });
//         // console.log("addedProduct: ",addedProduct);

/*          Producto Busqueda ID */

//         // const findProductById = await manager.getProductsById(3);
//         // console.log("findProductById: ", findProductById);

// /*          allProducts Busqueda */

//         // const allProducts = await manager.getProducts();

/*        Updateproducts elegir que se quiere modificar */

//         // const updatedProduct = await manager.updateProduct(
//         //     2, /* Cambiar ID de producto */
//         //     {
//         // //     title:"",
//         //     description:"Descripción modificada",
//         // //     price:"",
//         // //     thumbnail:"",
//         // //     code:"",
//         // //     stock:""

//         // });
//         // console.log("updatedProduct: ", updatedProduct)

/*        DeleteProduct */
//         const deletedProduct = await manager.deleteProduct(3);
//         console.log("DeleteProduct: ",deletedProduct)
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// principalFunction();

export {ProductManager};
