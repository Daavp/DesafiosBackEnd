import { chatModel } from "../../models/chat.model.js";

export class chatMongo{
    constructor(){
        this.model = chatModel;
    }
    async addMessage(message){
        try {
            console.log(message);
            const data = await this.model.create(message);
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`Hubo un error al guardar el mensaje`)
        }
    };

    async getMessages(){
        try {
            const data = await this.model.find();
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`Hubo un error al cargar los mensajes`)
        }
    }

}