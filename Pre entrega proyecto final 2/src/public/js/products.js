console.log("js products");

const cartId = document.getElementById("cartIdShop");

 const addToCart = async(productId)=>{
    if(!cartId.value){
        return  console.log("No hay ID de carrito en el cuadro de carrito")
    };
        resp =await fetch(`http://localhost:8080/api/carts/${cartId.value}/product/${productId}`,{
            method:'POST'
        });
        result = await resp.json();
        console.log("Status: ",result.status,"Message: ",result.message);
    }
//fetch de datos para crear carrito o agregar info a carrito