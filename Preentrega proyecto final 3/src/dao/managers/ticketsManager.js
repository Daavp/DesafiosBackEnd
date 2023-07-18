import { __dirname } from "../../utils.js";
import { ticketsModel } from "../../models/ticket.model.js"; 

export class ticketsManager {
    constructor (){
        this.model = ticketsModel;
    }
    async createTicket(product){
        try {
            const data = await this.model.create(product);
            return data;
        } catch (error) {
            throw new Error(`Error al crear el producto en la BD ${error.message}`);
        } 
    };

};