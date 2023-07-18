import { ticketsDao } from "../dao/factory.js";
const ticketManager = ticketsDao;

export class ticketsService{
    static async getCarts(){
        const result = cartManager.getCarts();
        return result;
    };
}