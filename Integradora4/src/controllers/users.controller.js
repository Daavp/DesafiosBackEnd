import { UsersService } from "../services/users.service.js";

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
    }
}