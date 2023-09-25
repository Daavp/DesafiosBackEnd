console.log("payments js");

const button = document.getElementById('checkout');
button.addEventListener('click', async()=>{
const res = await fetch(`http://localhost:8080/api/payments/create-checkout-session`, {
    method: 'POST',
});
const data = await res.json();
console.log(data);
window.location.href = data.url

});