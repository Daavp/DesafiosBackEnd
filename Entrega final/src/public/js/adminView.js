console.log("Admin view");


 const roleChange = async(userid)=>{
    try {
        const cuadroCambio = document.getElementById("newRole");
        resp =await fetch(`http://localhost:8080/api/users/premium/${userid}`,{
            method:'PUT'
        });
        result = await resp;
        console.log("resp",resp)
        console.log("Status: ",result.status,"Message: Cambio realizado");
        cuadroCambio.innerHTML ="";
            const newRoleChange = document.createElement("p");
            newRoleChange.innerHTML = `Cambio realizado, actualiza la pagina`;
            cuadroCambio.appendChild(newRoleChange);
    } catch (error) {
        console.log("No puedes hacer el cambio")
    }
    };
    const deleteUser = async(userid)=>{
        try {
            const userDelete = document.getElementById("deleteMessage");
            resp =await fetch(`http://localhost:8080/api/users/deleteUser/${userid}`,{
                method:'DELETE'
            });
            result = await resp;
            console.log("resp",resp)
            console.log("Status: ",result.status,"Message: Cambio realizado");
            userDelete.innerHTML ="";
                const userDeleted = document.createElement("p");
                userDeleted.innerHTML = `Usuario eliminado, actualiza la pagina`;
                userDelete.appendChild(userDeleted);
        } catch (error) {
            console.log("No puedes hacer el cambio")
        }
        };