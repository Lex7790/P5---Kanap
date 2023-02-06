// Récupération des données de l'api puis incrustation dans l'HTML 

const API_URL = "http://localhost:3000/api/products"

async function getapi(url) {
    const response = await fetch(url)

    var data = await response.json()
    console.log(data)

    insertdata(data)
}

getapi(API_URL)

function insertdata(data) {
    for (let item of data) {
        console.log(item.name);
        let insertCatalogue =

            '<a href="./product.html?id=' + item._id + '">\n' +
            '<article>\n' +
            '<img src="' + item.imageUrl + '" alt="'+item.altTxt+'">\n' +
            '<h3 class="productName">' + item.name + '</h3>' +
            '<p class="productDescription">' + item.description + '</p>\n' +
            '</article>\n' +
            '</a>';

        document.getElementById('items').innerHTML += insertCatalogue;

    }
}



