import { UsersService } from "../services/users.service.js";

export class userController{
    static modifyRole = async(req,res)=>{
        try {
            const userId=req.params.uid;
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;
            if(userRole === "user"){
                user.role = "premium";
            } else if(userRole ==="premium"){
                user.role = "user";
            } else {
                return res.send("No es posible cambiar el rol del usuario")
            };
            const result = await UsersService.updateUser(userId,user);
            res.send("Rol del usuario modificado");
            
        } catch (error) {
            res.send(error.message);
        }
    }
}