import { __dirname } from "../../utils.js";
import { productsModel } from "../../models/products.model.js";

export class productManagerDb {
    constructor (){
        this.model = productsModel;
    }
    async getPaginate(query,options){
        try {
            const result = await this.model.paginate(query,options);
            return result
        } catch (error) {
            return (`Error al obtener todos los productos ${error.message}`)
        }
    };

    async getProducts(){
        try {
            const result = await this.model.find();
            const data = JSON.parse(JSON.stringify(result));
            return data;
        } catch (error) {
            return (`Error al obtener los productos o no hay productos en la BD ${error.message}`);
        }
    };
    async getProductById(id){
        try {
            const result = await this.model.findById(id);
            const data = JSON.parse(JSON.stringify(result));
            if(!data){
                return (`El producto con el id ${id} no existe`);                
            };
            return data;
        } catch (error) {
            return (`Error al obtener el producto en la BD`);
        } 
    };
    async addProduct(product){
        try {
            const data = await this.model.create(product);
            return data;
        } catch (error) {
            return (`Error al crear el producto en la BD ${error.message}`);
        } 
    };
    async updateProduct(id,updateData){
        try {
            const data = await this.model.findByIdAndUpdate(id,updateData,{new:true});
            if(!data){
                return (`El producto con el id ${id} no existe`);                
            };
            return data;
        } catch (error) {
            return (`Error al actualizar el producto en la BD ${error.message}`);
        } 
    };
    async deleteProduct(id){
        try {
            const data = await this.model.findByIdAndDelete(id);
            if(!data){
                return (`El producto con el id ${id} no existe`);                
            };
            return {message:"Producto eliminado"};
        } catch (error) {
            return (`Error al eliminar el producto en la BD ${error.message}`);
        } 
    };


};