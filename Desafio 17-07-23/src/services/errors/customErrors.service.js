export class customError{
    //Estructura estandar del error
    static createError({name,cause,message,errorCode}){
        const error = new Error(message,{cause});
        error.name = name;
        error.errorCode = errorCode;
        console.log("Error: ",error);
        return error;
    }
}