const socketClient = io();

const chatEmail = document.getElementById("chatEmail");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");

sendMessage.addEventListener("click", ()=>{
    socketClient.emit("message",{
        user: chatEmail.value,
        message:chatInput.value
    });
    chatInput.value = "";
    
});

socketClient.on("msgHistory",(data)=>{
    console.log("data",data)
});