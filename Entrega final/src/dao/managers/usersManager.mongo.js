import { userModel } from "../../models/users.model.js";

export class UsersMongo{
    constructor(){
        this.model=userModel;
    };
    async getUserByEmail(userName){
        try {
            const user = await this.model.findOne({email:userName});
            if(user){
                return JSON.parse(JSON.stringify(user));
            } else{
                "El usuario no existe";
            }
        } catch (error) {
            return error;
        }
    };
    async getUsers(){
        try {
            let arrayUsers =[];
            const result = await this.model.find();

            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                arrayUsers.push({
                    role: item.role,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    email: item.email
                })
            }
                return JSON.parse(JSON.stringify(arrayUsers));
        } catch (error) {
            return error;
        }
    };
    async getUsersToDelete(){
        try {
            const result = await this.model.find();
                return JSON.parse(JSON.stringify(result));
        } catch (error) {
            return error;
        }
    };
    async getUserById(userId){
        try {
            const user = await this.model.findById(userId);
            if(!user){
                return new Error("El usuario no existe");
            }
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            return error;
        }
    };
    async deleteUser(id){
        try {
            const user = await this.model.findByIdAndDelete(id);
        } catch (error) {
            return error;
        }
    };
    async saveUser(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            return error;
        }
    };
    async updateUser(userId,newInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId,newInfo,{new:true});
            if(!userUpdated){
                return new Error("Usuario no encontrado");
            }
            return userUpdated;
        } catch (error) {
            return error;
        }
    };
    
}