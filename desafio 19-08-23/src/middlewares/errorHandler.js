import { EError } from "../middlewares/EError.js";//Codigo o tipos de errores

export const errorHandler = (error,req,res,next) =>{
    switch (error.errorCode) {
        case EError.ROUTING_ERROR:
                res.json({status:"error", message:error.message});
                break;
            case EError.INVALID_JSON:
                res.json({status:"error", message:error.cause});
                break;
            case EError.INVALID_PRODUCT_ID:
                res.json({status:"error", message:error.cause});
                break;
            case EError.INVALID_PRODUCT_UPDATE:
                res.json({status:"error", message:error.cause});
                break;
            case EError.INVALID_CART_ID:
                res.json({status:"error", message:error.cause});
                break;
            case EError.INVALID_CART_UPDATE:
                res.json({status:"error", message:error.cause});
                break;
            case EError.TIMEOUT_PURCHASE:
                res.json({status:"error", message:error.cause});
                break;
        default:
            break;
    }
}