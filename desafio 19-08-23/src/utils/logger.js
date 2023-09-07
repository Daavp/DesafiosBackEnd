import winston from "winston";
import { __dirname} from "../utils.js";
import path from "path";
import { options } from "../config/config.js";

const customLogger ={
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,   
    },
    colors:{
        fatal:'red',
        error:'yellow',
        warning:'cyan',
        info:'blue',
        http:'magenta',
        debug:'white',
    }
};

const devLogger = winston.createLogger({
    levels:customLogger.levels,
    transports:[
        new winston.transports.Console({
            level:"debug",
            format:winston.format.combine(
                winston.format.colorize({colors:customLogger.colors}),
                winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    levels:customLogger.levels,
    transports:[
        new winston.transports.Console({
            level:"info",
            format:winston.format.combine(
                winston.format.colorize({colors:customLogger.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({filename:path.join(__dirname,"/logs/errors-fatals.log"),
            level: "error",
        })
    ]
});

let logger;
if(options.server.appEnv === "production"){
    logger = prodLogger;
    logger.info("El logger actual es: prodLogger")
} else{
    logger = devLogger;
    logger.info("El logger actual es: devLogger")
};

export {logger};