export class generateUserErrorInfo{
    static errorGettingProducts(){
        return `Hay un error al intentar obtener los datos solicitados.`
    };
    static errorIdProducts(){
        return `Hay un error al intentar obtener los datos solicitados,ID incorrecto o formato no admitido.`
    };
    static errorUpdateProducts(){
        return `Hay un error al actualizar el producto indicado.`
    };
    static errorDeleteProducts(){
        return `Hay un error al eliminar el producto indicado o ya no existe.`
    };
    static errorAddProducts(){
        return `Hay errores con los parametros ingresados. Revisa que esten todos los necesarios.`
    };
    static errorGettingCarts(){
        return `Error al obtener carrito. Valida el ID correcto o que exista.`
    };
    static errorAddCart(){
        return `Error al crear nuevo carrito.`
    };
    static errorUpdateCart(){
        return `Hay errores con los parametros ingresados. Revisa que esten todos los necesarios.`
    };
    static errorEmptyCart(){
        return `Hay un error al vaciar el carrito.`
    };
    static errorPurchase(){
        return `Hay errores con los parametros de compra.`
    };
}