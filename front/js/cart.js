// Récupération de l'array au chargement de la page 

document.addEventListener ('DOMContentLoaded', async function () {
    let array = JSON.parse(localStorage.getItem("product")) 
    if (array == null) {
        console.log ("votre panier est vide");
    } else {
        fetchElement(array);
    }
}
);
// Fetch des données de chaque items de mon array (localstorage)

async function fetchElement (array) {
    let sumprice = 0;
    let sumqty = 0;
    for (let element of array) {
        let response = await fetch ("http://localhost:3000/api/products/"+element.productId);
        let data = await response.json();
        sumprice += data.price * element.quantity;
        sumqty += element.quantity;
        datatocart (data,element);
    }
    document.getElementById('totalQuantity').innerHTML = sumqty;
    document.getElementById('totalPrice').innerHTML = sumprice;
    // On ajoute ici la fonction addEventlistener, le cas échéant la récupération d'input sera impossible car les inputs ne seront pas encore créés dans notre html
    addevent();
}

function datatocart (data,element) {
    empty= "''"
    let insertitem = 
    
    '<article class="cart__item" data-id="'+ element.productId +'" data-color="' + element.color + '">\n' +
    '<div class="cart__item__img">\n' +
    '<img src="' + data.imageUrl + '" alt="' + data.altTxt +'">\n' +
    '</div>\n' +
    '<div class="cart__item__content">\n' +
    '<div class="cart__item__content__description">\n'+
    '<h2> '+ data.name + '</h2>\n' +
    '<p>' + element.color + '</p>\n' +
    '<p>' + data.price + '</p>\n' +
    '</div>\n'+
    '<div class="cart__item__content__settings">\n' +
    '<div class="cart__item__content__settings__quantity">\n' +
    '<p>Qté : </p>\n' +
    '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + element.quantity+'" oninput="validity.valid|| (value='+empty+');">\n' +
    '</div>\n' +
    '<div class="cart__item__content__settings__delete">\n' +
    ' <p class="deleteItem">Supprimer</p>\n' +
    '</div>\n' +
    '</div>\n' +
    '</div>\n' +
    '</article> ';
              
     document.getElementById('cart__items').innerHTML += insertitem;
}

function addevent() {
            // Changement de la quantité 
    document.querySelectorAll('.itemQuantity').forEach (function (input) {
        input.addEventListener ('change', function (){
            // Recherche l'ID du produit
            let articleId = input.closest('.cart__item').dataset.id;
            console.log(articleId);
            let articleColor = input.closest ('.cart__item').dataset.color;
            console.log(articleColor);
            // Récupération de la nouvelle quantité 
            let newQuantity = input.value;
            console.log (input.value);
            console.log (newQuantity);
            // Permet de mettre la quantité et le prix
            updateTotal ()
            let articles = JSON.parse(localStorage.getItem ('product')) || [];
            console.log (articles);
            //Permet de retrouver l'article correspondant à l'article et à la couleur
            let article = articles.find(function (item) {
                return item.productId == articleId && item.color == articleColor;
            });
        
            //Mettre à jour la quantité de l'article dans le local storage
            article.quantity = parseInt(newQuantity);
            // Mettre à jour le local storage 
            localStorage.setItem("product", JSON.stringify(articles));
        });
    });
            // Supression d'un article
    document.querySelectorAll('.deleteItem').forEach (function (deleteButton) {
        deleteButton.addEventListener ('click', function (){
            // Recherche de l'élément à supprimer
            let removeArticle = deleteButton.closest('.cart__item');
             // Recherche l'ID du produit
            let articleId = deleteButton.closest('.cart__item').dataset.id;
            let articleColor = deleteButton.closest ('.cart__item').dataset.color;
            // Suppression de l'article
            removeArticle.remove (); 
            // Permet de mettre la quantité et le prix
            updateTotal ()
            let articles = JSON.parse(localStorage.getItem ('product')) || [];
            //Permet de retrouver l'index correspondant à l'article et à la couleur
            let index = articles.findIndex(item => item.productId === articleId && item.color === articleColor);
            //Si l'élément n'existe pas, l'index est égal à -1 et donc mon "if" ne sera pas éxecuté 
            if (index !== -1) {
            // Supression de mon élément dans mon local storage
             articles.splice(index, 1);
            localStorage.setItem("product", JSON.stringify(articles));
            }
        });
    });
};

function updateTotal(){
    let sumprice = 0;
    let sumqty = 0;
// Fonction qui permet de récuperer le prix et la quantité de chaque élément.
    document.querySelectorAll('.itemQuantity').forEach (function (input) {
        let qty = parseInt (input.value)
        let price = parseInt (input.closest('.cart__item__content').querySelector('p:last-child').innerText);
        sumqty += qty;
        sumprice += qty * price;
    });
    document.getElementById('totalQuantity').innerHTML = sumqty;
    document.getElementById('totalPrice').innerHTML = sumprice;
};

// Envoi du formulaire

let form = document.querySelector ('.cart__order__form')
let inputs = document.querySelectorAll ('input,textarea')

form.addEventListener('submit',function (event) {
   
    // empêche la soumission du formulaire
    event.preventDefault(); 
    
   
    // Permet de déclarer ma variable contact qui détiendra les données de l'utilisateur 
    let contact = {}
    let productId = []
    let products = JSON.parse(localStorage.getItem("product")) || [];
    for (let item of products) {
        productId.push(item.productId);
    }
    inputs.forEach(function (input) {
         let name = input.name;
         let value = input.value;

    // Le switch est l'équivalent d'un bloc if else, il permet de rendre le code plus lisible et compréhensible et permettra de gagner en rapidité d'execution pour un nombre de cas important à tester.
     
        switch (name) {
            case 'firstName':
                if (!/^[a-zA-Z]{2,}$/.test(value)) {
                    document.getElementById("firstNameErrorMsg").innerHTML = 'Le prénom doit contenir au moins 2 lettres et ne doit pas contenir de chiffre.';
                    return;
                }
                contact.firstName = value;
                break;
            case 'lastName':   
                if (!/^[a-zA-Z]{2,}$/.test(value)) {
                    document.getElementById("lastNameErrorMsg").innerHTML = 'Le nom doit contenir au moins 2 lettres.';
                    return;
                }
                contact.lastName = value;
                break;
            case 'address':  
                if (!/^[a-zA-Z0-9\s,'-]{1,}$/.test(value)) {
                    document.getElementById("addressErrorMsg").innerHTML = 'Veuillez entrer une adresse valide.';
                    return;
                }  
                contact.address = value;
                break;
            case 'city':   
                if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ \-]{2,}$/.test(value)) {
                    document.getElementById("cityErrorMsg").innerHTML = 'Veuillez entrer une ville';
                    return;
                } 
                contact.city = value;
                break;
            case 'email':     
                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)) {
                    document.getElementById("emailErrorMsg").innerHTML = 'Veuillez entre une adresse email valide';
                    return;
                }
                contact.email = value;
                break;
        }
    });
    // Test de validation du formulaire 
    console.log (Object.keys(contact).length)
    console.log (products.length)
    console.log('bonjour1')
    if (Object.keys(contact).length === 5 && products.length > 0) {
        sendData (contact, productId)
        console.log ('bonjour2')
    }
});
async function sendData (contact, productId) {
    let data = {
        contact: contact,
        products: productId
    }
    let options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    await fetch ('http://localhost:3000/api/products/order', options)
        .then (response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.replace("confirmation.html?orderId="+data.orderId);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}