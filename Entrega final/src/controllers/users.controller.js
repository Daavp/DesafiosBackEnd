import { UsersService } from "../services/users.service.js";
import { deleteUserEmail } from "../utils/message.js";
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
            console.log("3 dias antes", deletemargin)
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

            }
/*             const userEmail = "daniel.avilap@hotmail.com";
            //Validar email existente
                const user = await UsersService.getUserByEmail(userEmail);
                if(user._id){
            //Enviar correo
                await deleteUserEmail(userEmail);
                res.send("Correo de eliminación enviado");
                } else{
                    console.log("Correo no encontrado")
                } */

            res.send(arrayFinal);
            
        } catch (error) {
            res.send(error.message);
        }
    };
    static deleteUser = async(req,res)=>{
        try {
            const userId=req.params.userId;
            const result = await UsersService.deleteUser(userId);
/*             const user = await UsersService.getUserById(userId);
            if(user.role == "admin"){
                return res.send("No es posible eliminar el usuario, es admin");
            } else {
                const result = await UsersService.deleteUser(userId);
                res.send("usuario eliminado");
                console.log("Usuario eliminado controller")
            };  */ 
            res.send("usuario eliminado");        
        } catch (error) {
            res.send(error.message);
        }
    };
}