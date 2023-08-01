import { __dirname } from "../../utils.js";
import { ticketsModel } from "../../models/ticket.model.js"; 

export class ticketsManager {
    constructor (){
        this.model = ticketsModel;
    }
    async createTicket(ticket){
        try {
            const data = await this.model.create(ticket);
            return data;
        } catch (error) {
            throw new Error(`Error al crear el ticket ${error.message}`);
        } 
    };
    async getUserTickets(user){
        try {
            const result = await this.model.find({purchaser:user});
            const data = JSON.parse(JSON.stringify(result));
            return data;
        } catch (error) {
            throw new Error(`Error al obtener ordenes ${error.message}`);
        } 
    };

    

};