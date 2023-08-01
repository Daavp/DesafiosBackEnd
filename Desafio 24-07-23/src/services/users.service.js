import { usersDao } from "../dao/factory.js";

const usersManager = usersDao;

export class UsersService{
    static async getUserByEmail(email){
        return usersDao.getUserByEmail(email);
    };

    static async getUserById(id){
        return usersDao.getUserById(id);
    };

    static async saveUser(userInfo){
        return usersDao.saveUser(userInfo);
    };
}