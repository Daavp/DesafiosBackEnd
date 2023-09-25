import dotenv from "dotenv";
dotenv.config();

export const options = {
    filesystem:{
        products:process.env.FILE_PRODUCTS,
        carts:process.env.FILE_CARTS
    },
    server:{
        port: process.env.PORT || 3000,
        secretSession: process.env.SESSIONSECRET,
        appEnv: process.env.NODE_ENV || "development",
        secretToken: process.env.SECRET_TOKEN,
    },
    mongo:{
        url:process.env.MONGO_URL,
    },
    persistance: process.env.PERSISTENCE,
    githubConfig:{
        clientId:process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GUTHUB_CLIENT_SECRET
    },
    gmail:{
        adminEmail:process.env.ADMIN_GMAIL,
        adminPass:process.env.ADMIN_PASS
    },
    stripe:{
        secretStripeBack:process.env.STRIPE_SECRET,
        siteDomain:"http://localhost:8080"
    },
}