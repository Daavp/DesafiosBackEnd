import { usersDao } from "../dao/factory.js";

const usersManager = usersDao;

export class UsersService{
    static async getUserByEmail(email){
        return usersDao.getUserByEmail(email);
    };
    static async getUsers(){
        return usersDao.getUsers();
    };
    static async getUsersToDelete(){
        return usersDao.getUsersToDelete();
    };
    
    static async getUserById(id){
        return usersDao.getUserById(id);
    };
    static async deleteUser(id){
        return usersDao.deleteUser(id);
    };

    static async saveUser(userInfo){
        return usersDao.saveUser(userInfo);
    };
    static async updateUser(userId,newInfo){
        return usersDao.updateUser(userId,newInfo);
    };
    
}