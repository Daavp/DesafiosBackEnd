import { options } from "../config/config.js";
import { connectDB } from "../config/dbConnection.js";

let productsDao;
let cartsDao;
let ticketsDao;
let usersDao;

switch (options.persistance) {
    case "mongo":
        const {productManagerDb} = await import("./managers/productManager.mongo.js");
        const {cartsManagerDb} = await import("./managers/cartManager.mongo.js");
        const {ticketsManager} = await import("./managers/ticketsManager.js");
        const {UsersMongo} = await import("./managers/usersManager.mongo.js");
        productsDao = new productManagerDb();
        cartsDao = new cartsManagerDb();
        ticketsDao = new ticketsManager();
        usersDao = new UsersMongo();
        connectDB();
        break;
};

export{productsDao, cartsDao, ticketsDao, usersDao};