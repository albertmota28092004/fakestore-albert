var productListContainer = document.getElementById("productListContainer");
var spinner = document.getElementById("spinner");
var successAlert = document.getElementById("success");
var myModal = new bootstrap.Modal(document.getElementById('editProductModal'));

function fetchProductsList() {
    spinner.style.display = "block";

    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            // Datos FakeStore
            let fakeStoreProducts = data;

            // Se obtienen datos del localStorage
            let createdProducts = JSON.parse(localStorage.getItem("createdProducts")) || [];
            let eliminatedProducts = JSON.parse(localStorage.getItem("eliminatedProducts")) || [];

            // Filtra los productos eliminados
            createdProducts = createdProducts.filter(product => !eliminatedProducts.includes(product.id));

            let allProducts = fakeStoreProducts.concat(createdProducts);

            allProducts.forEach(product => {
                createProductList(product);
            });

            spinner.style.display = "none";
        });
}


function createProductList(product) {
    let listCard = document.createElement("div");
    listCard.classList.add("list-card");
    listCard.setAttribute("data-product-id", product.id);

    let imageContainer = document.createElement("div");
    imageContainer.classList.add("img-container-list");

    let image = document.createElement("img");
    image.classList.add("img-list");
    image.src = product.image;
    image.style.width = "50px";
    image.style.height = "50px";

    imageContainer.appendChild(image);

    let detailsContainer = document.createElement("div");
    detailsContainer.classList.add("details-container");

    var id = document.createElement("p");
    id.textContent = `Id: ${product.id}`;

    let title = document.createElement("p");
    title.textContent = product.title;
    title.style.fontWeight = "bold";

    let price = document.createElement("p");
    price.textContent = `$ ${product.price}`;

    let category = document.createElement("p");
    category.textContent = `Category: ${formatCamelCase(product.category)}`;
    category.style.fontWeight = "bold";

    let description = document.createElement("p");
    description.textContent = `Description: ${product.description}`;

    let rating = document.createElement("div");
    rating.textContent = `Rating: `;

    let rate = document.createElement("p");
    rate.textContent = `Rate: ${product.rating.rate}`;

    let count = document.createElement("p");
    count.textContent = `Count: ${product.rating.count}`;

    rating.appendChild(rate)
    rating.appendChild(count)

    let coll = document.createElement("button");
    coll.classList.add("collapsible");
    coll.textContent = 'More info';
    coll.style.fontWeight = "bold";
    coll.style.border = "3px solid #021429";
    coll.style.borderRadius = "30px";
    coll.style.color = "#021429";

    let informationAdd = document.createElement("div");
    informationAdd.classList.add("content");
    informationAdd.style.display = "none";

    coll.addEventListener("click", function () {
        if (informationAdd.style.display == "block") {
            informationAdd.style.display = "none";
        } else if (informationAdd.style.display == "none") {
            informationAdd.style.display = "block";
        }
    })

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    editButton.addEventListener("click", function () {
        fillEditForm(product);
        myModal.show();
    });

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";

    deleteButton.addEventListener("click", function () {
        deleteProduct(product.id);
    });


    informationAdd.appendChild(title);
    informationAdd.appendChild(price);
    informationAdd.appendChild(category);
    informationAdd.appendChild(description);
    informationAdd.appendChild(rating);
    informationAdd.appendChild(editButton);

    imageContainer.appendChild(id);

    detailsContainer.appendChild(coll);
    detailsContainer.appendChild(informationAdd);

    listCard.appendChild(imageContainer);
    listCard.appendChild(detailsContainer);
    listCard.appendChild(deleteButton);

    /*listCard.appendChild(editButton);
    listCard.appendChild(deleteButton);*/
    productListContainer.appendChild(listCard);
}



function deleteProduct(id) {
    fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(deletedProduct => {
            deleteProductFromUI(id);
            showAlert("Deleted product successfully!")
        })
        .catch(error => console.error('Error al eliminar el producto:', error));
}


function deleteProductFromUI(productId) {
    console.log("Deleting product from UI:", productId);

    let productCard = document.querySelector(`.list-card[data-product-id="${productId}"]`);
    if (productCard) {
        console.log("Removing product from UI:", productId);
        productCard.remove();

        // Elimina el producto del localStorage
        let eliminatedProducts = JSON.parse(localStorage.getItem("eliminatedProducts")) || [];
        eliminatedProducts.push(productId);
        localStorage.setItem("eliminatedProducts", JSON.stringify(eliminatedProducts));
        productCard.style.display = "none";
    } else {
        console.log("Product card not found for ID:", productId);
    }
}


function loadEliminatedProducts() {
    console.log("Loading eliminated products...");
    let eliminatedProducts = JSON.parse(localStorage.getItem("eliminatedProducts")) || [];

    console.log("Eliminated Products:", eliminatedProducts);

    for (let productId of eliminatedProducts) {
        let productCard = document.querySelector(`.list-card[data-product-id="${productId}"]`);
        if (productCard) {
            console.log("Removing product from UI:", productId);
            productCard.remove();
        }
    }
}


loadEliminatedProducts();

function formatCamelCase(text) {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
function registerProduct() {
    event.preventDefault();
    let id = document.getElementById("id").value;
    let title = document.getElementById("title").value;
    let price = document.getElementById("price").value;
    let description = document.getElementById("description").value;
    let category = document.getElementById("category").value;
    let imageInput = document.getElementById("image");
    let rate = document.getElementById("rate").value;
    let count = document.getElementById("count").value;

    let image = imageInput.files[0];

    let imageElement = document.createElement("img");
    imageElement.src = URL.createObjectURL(image);
    imageElement.style.width = "50px";
    imageElement.style.height = "50px";

    let newProduct = {
        id: id,
        title: title,
        price: price,
        description: description,
        category: category,
        image: imageElement.src,
        rating: {
            rate: rate,
            count: count
        }
    };

    let createdProducts = JSON.parse(localStorage.getItem("createdProducts")) || [];
    createdProducts.push(newProduct);
    localStorage.setItem("createdProducts", JSON.stringify(createdProducts));

    createProductList(newProduct);
    successAlert.style.display = "block";

}

function showAlert(mensaje) {
    var alert = document.createElement('div');
    alert.classList.add('my-alert');
    alert.textContent = mensaje;
  
    document.body.appendChild(alert);
  
    setTimeout(function() {
        alert.remove();
    }, 3000);
  }

  let editingProductId;

  function fillEditForm(product) {
      editingProductId = product.id;
      document.getElementById("editTitle").value = product.title;
      document.getElementById("editPrice").value = product.price;
      document.getElementById("editDescription").value = product.description;
      document.getElementById("editCategory").value = product.category;
      /*document.getElementById("editRate").value = product.rating.rate;
      document.getElementById("editCount").value = product.rating.count;*/
  }
  
  document.getElementById("editProductForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    let editedTitle = document.getElementById("editTitle").value;
    let editedPrice = document.getElementById("editPrice").value;
    let editedCategory = document.getElementById("editCategory").value;
    let editedDescription = document.getElementById("editDescription").value;
    /*let editedRate = document.getElementById("editRate").value;
    let editedCount = document.getElementById("editCount").value;*/

    let productCard = document.querySelector(`.list-card[data-product-id="${editingProductId}"]`);

    if (productCard) {
        let titleElement = productCard.querySelector(".details-container p:nth-child(1)");
        titleElement.textContent = editedTitle;
        let priceElement = productCard.querySelector(".details-container p:nth-child(2)"); 
        priceElement.textContent = `Price: ${editedPrice}`;
        let categoryElement = productCard.querySelector(".details-container p:nth-child(3"); 
        categoryElement.textContent = `Category: ${editedCategory}`;
        let descriptionElement = productCard.querySelector(".details-container p:nth-child(4)"); 
        descriptionElement.textContent = `Description: ${editedDescription}`;
        /*let rateElement = productCard.querySelector(".details-container p:nth-child(5)"); 
        rateElement.textContent = `Rate: ${editedRate}`;
        let countElement = productCard.querySelector(".details-container p:nth-child(6)"); 
        countElement.textContent = `Count: ${editedCount}`;*/
    
    }

    myModal.hide();
});
