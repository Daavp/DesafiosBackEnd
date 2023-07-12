//Importar persistencia (Manager)
import { productManagerDb } from "../dao/managers/productManager.mongo.js";
const productManager = new productManagerDb();

export class ProductsService{
    static getProducts(query,options){
        const result = productManager.getPaginate(query,options);
        return result;
    };
    static getProductById(id){
        const result = productManager.getProductById(id);
        return result;
    };
    static updateProduct(id,updateData){
        const result = productManager.updateProduct(id,updateData);
        return result;
    };
    static deleteProduct(id){
        const result = productManager.deleteProduct(id);
        return result;
    };
    static addProduct(product){
        const result = productManager.addProduct(product);
        return result;
    };
}