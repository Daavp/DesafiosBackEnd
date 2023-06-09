import express from "express";
import {ProductManager} from "./productManager.js";

const app = express();
const port = 8080;
const manager = new ProductManager("./products.json");

// USO DE QUERY http://localhost:8080/products?limit= numero
app.get("/products",async (req,res)=>{
    try {
        const allProducts = await manager.getProducts();
        const limit = req.query.limit;

        if(!limit){
         // Todos los productos        
            return res.send(allProducts);
            };
            if (isNaN(limit)){
                console.log("limit no es numero: ", limit)
                return res.status(500).send("Limite ingresado de productos no valido, no pueden haber letras")
            };

    // Limite de producto                       
        const productsLimit = parseInt(req.query.limit);
        const productsDisplay = allProducts.filter(u=>u.id <=productsLimit);
        res.send(productsDisplay);
        // console.log("Limit: ", productsDisplay)
        console.log("limit", limit)
    } catch (error) {
        res.status(500).send;
    }

});

// Busqueda de ID PARAMS
app.get("/products/:pid",async (req,res)=>{
    try {
        const allProducts = await manager.getProducts();
        const idProduct = parseInt(req.params.pid);
        const searchProduct = allProducts.find(u=>u.id === idProduct); //Busqueda de numero ID
        if (isNaN(req.params.pid)){
            console.log("El id que buscas no es un numero: ", idProduct)
            return res.status(500).send(`Id de productos son solo numeros, pueden haber letras: ${req.params.pid}`)
        };
        if(!searchProduct){ //Si no lo encuentra da mensaje
            return res.status(500).send(`Producto con el id ${idProduct} no existe, intenta con otro numero.`)
        };
        res.send(searchProduct);//Si lo encuentra entrega el producto
        // console.log("productid", idProduct)
    }
     catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port,()=>console.log(`Server listening on port ${port}`));




/* 
ruta /products devolver dentro de un objeto

query param valor?limit = limite de resultados

Si no recibe limite, muestra todo

Si hay limite, mostrar productos solicitados

ruta /products/:pid   debe revibnir req params el pid y devolver producto solicitado. */