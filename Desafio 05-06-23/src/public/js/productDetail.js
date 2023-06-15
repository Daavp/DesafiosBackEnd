console.log("js products");

    const addToCart = async(productId)=>{
        try {
            const userLog = document.getElementById("cartId");
            const cartId = userLog.innerText;
            console.log(userLog.innerText);
            resp =await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`,{
                method:'POST'
            });
            result = await resp.json();
            console.log("Status: ",result.status,"Message: ",result.message);
        } catch (error) {
            console.log("No hay sesión iniciada")
        }
        }