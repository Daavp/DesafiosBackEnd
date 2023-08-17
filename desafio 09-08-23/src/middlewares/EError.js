export const EError ={
    ROUTING_ERROR:1, //Ruta no existe
    DATABASE_ERROR:2, //error de conexion a la BD
    AUTH_ERROR:3, //rol no tiene permisos
    INVALID_JSON:4, //Datos recibidos incompletos


    //Errores de productos
    INVALID_PRODUCT_ID:30,//ID de prodcuto no valido
    INVALID_PRODUCT_UPDATE:31,//Parametros Update no validos


    //Errores Carritos
    INVALID_CART_ID:41,
    INVALID_CART_UPDATE:42,
    TIMEOUT_PURCHASE:43
}