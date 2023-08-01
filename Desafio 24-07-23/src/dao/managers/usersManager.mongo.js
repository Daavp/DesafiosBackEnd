import { userModel } from "../../models/users.model.js";

export class UsersMongo{
    constructor(){
        this.model=userModel;
    };
    async getUserByEmail(userName){
        try {
            const user = await this.model.findOne({email:userName});
            return user;
        } catch (error) {
            throw error;
        }
    };
    async getUserById(userId){
        try {
            const user = await this.model.findById(userId);
            if(!user){
                throw new Error("El usuario no existe");
            }
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            throw error;
        }
    };
    async saveUser(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    };
}