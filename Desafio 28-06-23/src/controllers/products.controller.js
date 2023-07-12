//importar servicio de productos
import { ProductsService } from "../services/products.service.js";

export class ProductsController{
    static async getProducts(req,res){
            try {
                const {limit =10, page=1, sort="asc", category, stock} = req.query;
                if([!"asc","desc"].includes(sort)){
                    res.json({status:"error", message:"Ordenamiento no valido, ingresar asc o desc"})
                };
                const sortValue = sort === "asc" ? 1 : -1;
                const stockValue = stock === 0 ? undefined : parseInt(stock);
                let query = {};
                    if(category && stock){
                        query = {category: category, stock: stockValue}
                    } else{
                        if(category|| stockValue){
                            if (category){
                                query ={category:category}
                            }else{
                                query ={stock:stockValue}
                            }
                        }
                    };
        /*            console.log("limit",limit,"page",page,"sortvalue",sortValue,"category",category,"stock",stockValue) 
                   console.log("query",query); */
                   const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
                    const result = await ProductsService.getProducts(query, {
                        page,
                        limit,
                        sort:{price:sortValue},
                        lean:true
                    });
                    console.log("result",result);
                    const response ={
                        status: "success",
                        payload:result.docs,
                        totalPages:result.totalPages,
                        prevPage:result.prevPage,
                        nextPage:result.nextPage,
                        page:result.page,
                        hasPrevPage:result.hasPrevPage,
                        hasNextPage:result.hasNextPage,
                        prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
                        nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null,
        
        
                    };
                    console.log("response",response);
                    res.json(response);
        
            } catch (error) {
                res.status(500).send({status:"Error al obtener los productos"});
            }
    };
    static async getProductById(req,res){
            try {
                const data = await ProductsService.getProductById(req.params.pid);
                if(!data){ //Si no lo encuentra da mensaje
                    return res.send(`Producto con el id ${req.params.pid} no existe, intenta con otro ID.`)
                };
                res.send(data);//Si lo encuentra entrega el producto
            }
             catch (error) {
                res.status(500).send({status:"Error al obtener los productos"});
            }
    };
    static async updateProduct(req,res){
        try {
            const productId = req.params.pid;
            const updateData = req.body;
            if(updateData._id != productId){
                return res.status(400).send({status:"No puedes modificar o eliminar el id de productos ya existentesen la DB"});
            };
            console.log("Podemos buscar para modificar");
            const updateProduct = await ProductsService.updateProduct(productId,updateData);
            return res.json({status:"success",message:"Producto modificado con exito",data:updateProduct});//Producto modificado
        }
            catch (error) {
            return res.status(500).send({message:error.message});
        }
    };
    static async deleteProduct(req,res){
        try {
            console.log("Podemos eliminar");
            const idProduct = req.params.pid;
            const deleteProduct = await ProductsService.deleteProduct(idProduct);
            return res.json({status:"success",message:`Producto con id:${idProduct} eliminado.`});//Producto eliminado
        }
         catch (error) {
            return res.status(500).send({message:error.message});
        }
    };
    static async addProduct(req,res){
        try {
            const {title,description,code,price,status,stock,category,thumbnails} = req.body;
            const newProduct = req.body;
            const productSaved = await ProductsService.addProduct(newProduct);
            res.json({status:"success", message:"Producto creado", data:productSaved}); //Mensaje de exito de producto creado
        } catch (error) {
            return res.status(500).send({message:error.message});
        }
    };
}