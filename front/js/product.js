// Identification de l'ID de l'article choisi

let url = new URL(window.location.href);
let id = url.searchParams.get("id");
console.log(id)

async function getapi(url) {
    const response = await fetch(url)

    var data = await response.json()
    console.log(data)

    insertdata(data)
}
//appel des données

let fetchURL = 'http://localhost:3000/api/products/'+id;

getapi(fetchURL);

// Initialisation des variables 

function insertdata(data) {
    let insertimg =

    '<img src="'+data.imageUrl+'" alt="'+data.altTxt+'"></img>';

    // Incrustation des données         

    document.getElementsByClassName("item__img")[0].innerHTML = insertimg;
    document.getElementById('title').innerHTML = data.name;
    document.getElementById('price').innerHTML = data.price;  
    document.getElementById('description').innerHTML = data.description;

    // Création d'une boucle pour les options de couleurs 

    for (const color of data.colors) {
        const option = document.createElement("option");
        option.value = color;
        option.innerHTML = color;
        colors.appendChild(option);
    }
}
// Envoi vers le Local Storage 

let button = document.getElementById("addToCart")
button.addEventListener ("click", () => {
    
    if (document.getElementById('colors').value == "" && document.getElementById('quantity').value == 0){
        const para = document.createElement("p")
        para.innerHTML = "Veuillez choisir une couleur et une quantité";
        document.getElementsByClassName ("item__content__addButton") [0].appendChild(para);
    } else if (document.getElementById('colors').value == ""){
        const para = document.createElement("p")
        para.innerHTML = "Veuillez choisir une couleur";
        document.getElementsByClassName ("item__content__addButton") [0].appendChild(para);
    } else if (document.getElementById('quantity').value == 0){
        const para = document.createElement("p")
        para.innerHTML = "Veuillez choisir une quantité";
        document.getElementsByClassName ("item__content__addButton") [0].appendChild(para);
    } else {
        let productInlocalStorage = JSON.parse (localStorage.getItem ("product"))
       
        let optionsProduct = 
        {
            productId: id,
            quantity: parseInt(document.getElementById('quantity').value),
            color: document.getElementById('colors').value,
        }

    // Si produit dans le localstorage

        if (productInlocalStorage) {
            
            let itemIdx = productInlocalStorage.findIndex(item => item.productId === id && item.color == document.getElementById('colors').value);
            var item = productInlocalStorage[itemIdx] || null;
            if (item == null){
                productInlocalStorage.push (optionsProduct)
                localStorage.setItem("product",JSON.stringify(productInlocalStorage))
            } else {
                item.quantity += parseInt(document.getElementById('quantity').value);
                localStorage.setItem("product",JSON.stringify(productInlocalStorage));
            }
        } else {
             // Si produit absent du localstorage
            productInlocalStorage = []
            productInlocalStorage.push (optionsProduct)         
            localStorage.setItem("product",JSON.stringify(productInlocalStorage))
        } 
    }
}
)
