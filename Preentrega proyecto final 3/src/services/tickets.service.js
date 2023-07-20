import { ticketsDao } from "../dao/factory.js";
const ticketManager = ticketsDao;

export class ticketsService{
    static async createTicket(ticket){
        const result = ticketManager.createTicket(ticket);
        return result;
    };
    static async getUserTickets(user){
        const result = ticketManager.getUserTickets(user);
        return result;
    };
}