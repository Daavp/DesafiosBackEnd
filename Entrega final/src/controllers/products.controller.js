//importar servicio de productos
import { ProductsService } from "../services/products.service.js";
import { UsersService } from "../services/users.service.js";
import { customError } from "../services/errors/customErrors.service.js";//Estructura
import { EError } from "../middlewares/EError.js";//Codigo o tipos de errores
import { generateUserErrorInfo } from "../services/errors/userErrorInfo.service.js";//Mensaje personalizado

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
                res.status(500).send({status:
                    customError.createError({
                        name:"Error al obtener los productos",
                        cause:generateUserErrorInfo.errorGettingProducts(),
                        message:"Error al obtener los productos",
                        errorCode:EError.INVALID_PRODUCT_ID
                    })
                }); 
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
                res.status(500).send({status:
                    customError.createError({
                        name:"Error al obtener los producto",
                        cause:generateUserErrorInfo.errorIdProducts(),
                        message:"Hubo un error al obtener el producto",
                        errorCode:EError.INVALID_PRODUCT_ID
                    })
                });                
            }
    };
    static async updateProduct(req,res){
        try {
            const productId = req.params.pid;
            const updateData = req.body;
            if(updateData._id != productId){
                return res.status(400).send({status:
                    customError.createError({
                        name:"Error al actualizar producto",
                        cause:generateUserErrorInfo.errorUpdateProducts(),
                        message:"No puedes modificar o eliminar el id de productos ya existentesen la DB",
                        errorCode:EError.INVALID_PRODUCT_UPDATE
                    })
                });
            };
            console.log("Podemos buscar para modificar");
            const updateProduct = await ProductsService.updateProduct(productId,updateData);
            return res.json({status:"success",message:"Producto modificado con exito",data:updateProduct});//Producto modificado
        }
            catch (error) {
            return res.status(500).send({status:
                customError.createError({
                    name:"Error al actualizar producto",
                    cause:generateUserErrorInfo.errorUpdateProducts(),
                    message:"Ha habido un problema al actualizar el producto en la base de datos, revisa los datos ingresados",
                    errorCode:EError.INVALID_PRODUCT_UPDATE
                })
            });
        }
    };
    static async deleteProduct(req,res){
        try {
            const idProduct = req.params.pid;
            const userId = await UsersService.getUserByEmail(req.user.email);
            const product = await ProductsService.getProductById(idProduct);
            console.log("userID ",userId._id, "productid ", idProduct);
            //Validación user premium // === Compara valor y tipo de dato // == solo valor
            if(req.user.role === "premium" && product.owner == userId._id || req.user.role === "admin"){
                const deleteProduct = await ProductsService.deleteProduct(idProduct);
                return res.json({status:"success",message:`Producto con id:${idProduct} eliminado.`});//Producto eliminado
            }   else{
                return res.json({status:"Error",message:`No tienes permisos para eliminar el producto con id:${idProduct} o ya no existe.`});
            }         
        }
         catch (error) {
            return res.status(500).send({status:
                    customError.createError({
                    name:"Error al eliminar el producto",
                    cause:generateUserErrorInfo.errorDeleteProducts(),
                    message:"Ha habido un problema al eliminar el producto en la base de datos, revisa los datos ingresados",
                    errorCode:EError.INVALID_PRODUCT_UPDATE
                })
            });
        }
    };
    static async addProduct(req,res){
        try {
            const {title,description,code,price,status,stock,category,thumbnails} = req.body;
            const userId = await UsersService.getUserByEmail(req.user.email);
            const newProduct = {
                ...req.body,
                owner: userId._id
            };
            const productSaved = await ProductsService.addProduct(newProduct);
            res.json({status:"success", message:"Producto creado", data:productSaved}); //Mensaje de exito de producto creado
        } catch (error) {
            return res.status(500).send({status:
                customError.createError({
                name:"Error al agregar el producto",
                cause:generateUserErrorInfo.errorAddProducts(),
                message:"Ha habido un problema al agregar el producto en la base de datos, revisa los datos ingresados o tener los permisos",
                errorCode:EError.INVALID_PRODUCT_UPDATE
            })
        });
        }
    };
}