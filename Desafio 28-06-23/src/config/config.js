import dotenv from "dotenv";
dotenv.config();

export const options = {
    filesystem:{
        products:process.env.FILE_PRODUCTS,
        carts:process.env.FILE_CARTS
    },
    server:{
        port:process.env.PORT || 3000
    },
    mongo:{
        url:process.env.MONGO_URL,
    }
}