import dotenv from "dotenv";
dotenv.config();

export const options = {
    filesystem:{
        products:"products.json",
        carts:"carts.json"
    },
    server:{
        port:process.env.PORT || 3000
    },
    mongo:{
        url:process.env.MONGO_URL,
    }
}