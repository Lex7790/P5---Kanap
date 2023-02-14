// Récupération des données de contact via l'URL

const url = new URL(window.location.href);
const orderId = url.searchParams.get("orderId");

document.addEventListener('DOMContentLoaded', function() {
    if (orderId !== null) {
        document.getElementById('orderId').innerHTML = orderId;
        localStorage.clear();
    } else {
        alert ("Veuillez procéder à votre commande");
    }
})
