import {Router} from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { checkRoles, UserAuthviews } from "../middlewares/auth.js";

//Grupo de rutas de products
const router = Router();
//Obtener carritos
router.get("/getCarts",CartsController.getCarts);
// Rutas de Productos Metodos POST => crear nuevo carrito. id:number NO SE DEBEN DUPLICAR AUTOGENERABLE, products: array que contendra objetos que representen cada producto
    //Crear carrito con /api/carts/:cid
router.post("/",CartsController.addCart);
// Rutas de Productos Metodos GET    //Mostrar carrito y listar productos carrito con /:cid
router.get("/:cid",CartsController.getCartById);
// Rutas de Productos Metodos POST /:cid/product/:pid
    //debe agregar el producto al arreglo products del carrito seleccionado
        //product:debe contener ID del producto solamente. quantity: debe contener numero de ejemplares del producto, se agregará uno a uno. Si ya existe producto se debe agregar
        //al producto  e incrementar el campo quantity del producto.    
router.post("/:cid/product/:pid",UserAuthviews,checkRoles(["user","premium"]),CartsController.addProductToCart);
// DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
router.delete("/:cid/products/:pid",CartsController.deleteProductFromCart);
//PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
//array= 
/* {
    "product":"646ad444d05c674202b03bef", //string
    "quantity":20
} */
router.put("/:cid",UserAuthviews,checkRoles(["user"]), CartsController.addProductToCartArray);
//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put("/:cid/products/:pid", CartsController.changeProductQuantity);
//DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
router.delete("/:cid", CartsController.emptyCart);
//Ruta purchase
router.get("/:cid/purchase",CartsController.purchase);
export {router as routerCart};