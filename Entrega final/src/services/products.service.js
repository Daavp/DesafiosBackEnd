//Importar persistencia (Manager) de la factory
import { productsDao } from "../dao/factory.js";
const productManager = productsDao;

export class ProductsService{
    static getProducts(query,options){
        const result = productManager.getPaginate(query,options);
        return result;
    };
    static getAllProducts(){
        const result = productManager.getProducts();
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