const socketClient = io();

/* Mostrar todo como se vio en el historial de mensajes, 

Cambiar mensajes por productos
Crear formulario simple en donde haya botones que eliminen productos con eventos
 */
socketClient.on("wellcomeMsg",(data)=>{
    console.log(data)
});

const allProductsObj =document.getElementById("allProducts");

socketClient.on("allProductsServer",(data)=>{
    allProducts.innerHTML ="";
    data.forEach(itemProd => {
        const product = document.createElement("p");
        product.innerHTML = `Title: ${itemProd.title} Code: ${itemProd.code}
        Description: ${itemProd.description} Id: ${itemProd.id} Price: ${itemProd.price} thumbnail: ${itemProd.thumbnail}`;
        allProducts.appendChild(product);
    });
})