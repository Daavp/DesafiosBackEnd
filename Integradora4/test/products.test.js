import mongoose from "mongoose";
import { productManagerDb } from "../src/dao/managers/productManager.mongo.js";
import Assert from "assert";

import chai from "chai";
import supertest from "supertest";
import {app} from "../src/app.js"
import { Cookie } from "express-session";
import { response } from "express";

const expect = chai.expect;
const requester = supertest(app);

describe("Testing Autenticación", ()=>{
    let user;
    it("Endpoint: /api/sessions/login Permite iniciar sesión", async function(){
        const loginCredentials = {
            email:"coder1@coder.com",
            password:"1234"
        };
        const user = await requester.post("/api/sessions/login").send({email:loginCredentials.email, password:loginCredentials.password});
    });
    it("Endpoint /api/products crea producto exitosamente",
    async function(){
        const loginCredentials = {
            email:"coder1@coder.com",
            password:"1234"
        };
        const user = await requester.post("/api/sessions/login").send({email:loginCredentials.email, password:loginCredentials.password});
        const userData = {
            _id: user.body._id,
            email:user.body.email
        };
        console.log("userDataTest ", userData);
        const newProduct = {
            title:"Producto prueba test 2", //string
            description:" Descripcion prueba test 2", //string
            code:"test00002", //string
            price:100, //number
            status:"true", //boolean = true
            stock:6, //number
            category:"Categoría test 1", //string
            ...userData
        };
        const result = await requester.post("/api/products").send(newProduct);
        console.log(result.body);
        console.log("Se ha creado el producto");
    });
    it("Cierre de sesión",
        async function(){
           const response = await requester.get("/api/sessions/logout");
           console.log("Se ha cerrado la sesión");
    });
    it("elimnar producto",
    async function(){
        const loginCredentials = {
            email:"coder1@coder.com",
            password:"1234"
        };
        const user = await requester.post("/api/sessions/login").send({email:loginCredentials.email, password:loginCredentials.password});
        const userData = {
            _id: user.body._id,
            email:user.body.email
        };
        console.log("userDataTest ", userData);
        const responseDelete = await requester.delete(`/api/products/64eeb82e6a4338da6b6df363`);
        console.log(`Se ha eliminado el producto`);
        console.log("response ",responseDelete.body)
});
    
});

//describe("Testing productos", ()=>{


/*     it("Endpoint se crea producto exitosamente",
    async function(){

    });
    it("Endpoint se crea producto exitosamente",
    async function(){

    }) */

//});


/* sessions

1 registro usuario con carrito

2 Crear usuario con categoria

3 Crear usuario y no devolver contraseña

Carrito

1 Carrito asignado a usuario

2 Añadir producto a carrito

3 Se elimina producto de carrito
 */
