import {Router, json} from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { checkRoles, UserAuthviews } from "../middlewares/auth.js";
//Importar controladores

//Grupo de rutas de products
const router = Router();

router.get("/", ProductsController.getProducts);
// Rutas de usuarios Metodos GET    //Obtener productos con ?LIMIT
router.get("/:pid", ProductsController.getProductById);
// Rutas de Productos Metodos POST => Nuevo producto con id autogenerable  OK AMBOS   //Crear productos
router.post("/",UserAuthviews,checkRoles(["admin","premium"]), ProductsController.addProduct);
// Rutas de Productos Metodos PUT => NO DEBE ACTUALIZAR O ELIMINAR ID  // PARA MONGO   //Actualizar productos con /:pid
router.put("/:pid",UserAuthviews,checkRoles(["admin"]), ProductsController.updateProduct);
// Rutas de Productos Metodos DELETE =>  //Eliminar productos con /:pid PARA MONGO
router.delete("/:pid",UserAuthviews,checkRoles(["admin","premium"]), ProductsController.deleteProduct);  

export {router as routerProducts};