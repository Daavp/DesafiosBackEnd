const socketClient = io();
const chatEmail = document.getElementById("chatEmail");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const noInput = document.getElementById("errorMessage");

sendMessage.addEventListener("click", ()=>{
    const mailFormat = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

    if( !mailFormat.test(chatEmail.value) ){//validar mail
		alert(`Formato de correo electronico invalido, intenta nuevamente`);
	} else if(chatInput.value.trim().length<=0){//evita que se manden chat vacios
            chatInput.value = "";
            const errorMessage = "Casilla de mensaje vacia o con solo espacios"
            noInput.innerHTML = errorMessage;
    }
    else{
    socketClient.emit("message",{
        
        user: chatEmail.value,
        message:chatInput.value.trim()//no se mandan espacios vacios
    });
    chatInput.value = "";

}});

socketClient.on("msgHistory",(data)=>{
    console.log("data",data);
    let log = document.getElementById("messagesLogs");
    messageElements = "";
    data.forEach(itemMsg => {
        messageElements = messageElements + `${itemMsg.user}: ${itemMsg.message} <br/>`;
    });
    log.innerHTML = messageElements;
    noInput.innerHTML = "";
});
