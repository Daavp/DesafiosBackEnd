import { UsersService } from "../services/users.service.js";
import { deleteUserEmail } from "../utils/message.js";
import { deleteUserEmailPremium } from "../utils/message.js";
import { ProductsService } from "../services/products.service.js";

export class userController{
    static modifyRole = async(req,res)=>{
        try {
            const userId=req.params.uid;
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;
            if(userRole === "user"&& user.status==="Completo"){
                user.role = "premium";
            } else if(userRole ==="premium"){
                user.role = "user";
            } else {
                return res.send("No es posible cambiar el rol del usuario, revisa tener todos tus datos actualizados")
            };
            const result = await UsersService.updateUser(userId,user);
            res.send("Rol del usuario modificado");
            
        } catch (error) {
            res.send(error.message);
        }
    };
    static uploadDocuments = async(req,res)=>{
        try {
            const userId=req.params.uid;
            const user = await UsersService.getUserById(userId);
            if(!user){
                return res.json({status:"error", message:"El usuario no existe"});
            }
/*             console.log("req.files", req.files); */
            const identification = req.files["identificacion"]?.[0] || null;
            const domicilio = req.files["domicilio"]?.[0] || null;
            const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
            const docs = [];
            if(identification){
                docs.push({name:"identificacion", reference:identification.filename})
            };
            if(domicilio){
                docs.push({name:"domicilio", reference:domicilio.filename})
            };
            if(estadoDeCuenta){
                docs.push({name:"estadoDeCuenta", reference:estadoDeCuenta.filename})
            };
            console.log(docs);
            user.documents = docs;
            if(user.documents.length === 3){
                user.status = "Completo";
            } else {
                user.status = "Incompleto";
            };
            await UsersService.updateUser(user._id,user);
            res.json({status:"success", message:"Solicitud procesada"})
            
        } catch (error) {
            res.send(error.message);
        }
    };
    static getUsers = async(req,res)=>{
        try {
            const users = await UsersService.getUsers();
            res.send(users);
            
        } catch (error) {
            res.send(error.message);
        }
    };
    static getUsersToDelete = async(req,res)=>{
        try {
            const result = await UsersService.getUsersToDelete();
            
            let resultLength = result.length;
            console.log("resultLength ",resultLength);
            const lastConnectionAllowed = new Date();
            const deletemargin = new Date();
            const fechaUsuario = Date.parse(req.user.last_connection)
            lastConnectionAllowed.setHours(0);
            deletemargin.setHours(-48);//Tiempo de espera para que se eliminen los datos 2 días
            let arrayUsuarios = result.filter(result => result.last_connection == null || Date.parse(result.last_connection) < deletemargin.getTime()|| result.last_connection == "null");
            let arrayFinal = arrayUsuarios.filter(result => result.role != 'admin');
            console.log("2 dias antes", deletemargin)
            console.log("lastConnectionAllowed ", lastConnectionAllowed);
            console.log("req to delete " ,fechaUsuario);
            console.log("ArrayUsuarios largo" , arrayUsuarios.length);
            console.log("arrayfinal sin admins largo", arrayFinal.length);

/*             console.log("ArrayUsuarios" , arrayUsuarios); */
            
            for (let i = 0; i < arrayFinal.length; i++) {
                const item = arrayFinal[i];
                console.log("Enviar correo a: ",item.email);
                const userEmail = item.email/* req.body */;
                //Validar email existente
                    const user = await UsersService.getUserByEmail(userEmail);
                    console.log("Eliminar usuario: ", item._id);
                    //Falta solo poner funcion de eliminar

            };
//Correo individual de eliminación de productos y de borrado de cuenta
            const userEmail = "daniel.avilap@hotmail.com";
            //Validar email existente
                const user = await UsersService.getUserByEmail(userEmail);
                if(user._id){
                    const userProductsPremium = await ProductsService.getAllProducts();
                    let arrayProductsPremium = userProductsPremium.filter(result => result.owner == user._id);
                    let arrayProductsPremiumFinal = [];
                    arrayProductsPremium.map(function(element,index,array){
                        arrayProductsPremiumFinal.push({htmlMessage:`<div> Producto eliminado: ${element.title}
                        codigo:${element.code}
                        Stock:${element.stock}</div>`});
                        //Agregar aqui eliminación de productos
                    });
                    let arrayProductsDelete = [];
                    for (let i = 0; i < arrayProductsPremium.length; i++) {
                        const element = arrayProductsPremium[i];
                        //Poner el delete product by id
                       const productDelete = await ProductsService.getProductById(element._id)
                        arrayProductsDelete.push(productDelete._id)
                    };
                    console.log("arrayProductsDelete",arrayProductsDelete)
                    const finaldata = arrayProductsPremiumFinal.map(item => item.htmlMessage);
                    const finaldataMessage = {...finaldata};
                    console.log("arrayProductsPremiumFinalhtml",JSON.stringify(finaldataMessage));
                    console.log("arrayProductsPremium ",arrayProductsPremium)
                    console.log("arrayProductsPremiumFinal",arrayProductsPremiumFinal)
            //Enviar correo
                await deleteUserEmail(userEmail);
                await deleteUserEmailPremium(userEmail,JSON.stringify(finaldataMessage))
                } else{
                    console.log("Correo no encontrado")
                }

            res.json(arrayFinal);
            
        } catch (error) {
            res.json(error.message);
        }
    };
    static deleteUser = async(req,res)=>{
        try {
            const userId= req.params.userid;
            console.log("req.params",userId)
            const user = await UsersService.getUserById(userId);
            if(user.role == "admin"){
                return res.send("No es posible eliminar el usuario, es admin");
            } else {
                const result = await UsersService.deleteUser(userId);
                res.json({status:"success", message:"Usuario eliminado"})
                console.log("Usuario eliminado controller")
            };         
        } catch (error) {
            res.send({status:"Error", message:"No se pudo eliminar al usuario"});
        }
    };
}