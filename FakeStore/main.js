var productContainer = document.querySelector(".product-container");
var spinner = document.querySelector("#spinner");
var previous = document.querySelector("#previous");
var next = document.querySelector("#next");
var offcanvas = new bootstrap.Offcanvas(document.getElementById("demo"));
var productInOffcanvas = document.querySelector(".offcanvas-body .productCar");
var productsInCart = []; 

let limit = 8;
let offset = 1;

/*    */


previous.addEventListener("click", () => {
  if (offset != 1) {
    offset -= 9;
    removeChildNodes(productContainer);
    fetchProducts(offset, limit);
  }
});

next.addEventListener("click", () => {
  offset += limit; // Incrementa el valor de offset

  if (offset <= 20) { // Limita el valor de offset para evitar solicitudes innecesarias
    removeChildNodes(productContainer);
    fetchProducts(offset, limit);
  } else {
    // Aquí puedes manejar el caso en que no hay más páginas disponibles.
    // Por ejemplo, puedes deshabilitar el botón "next" o mostrar un mensaje al usuario.
  }
});


function fetchProduct(id) {
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
      createProduct(data);
      spinner.style.display = "none";
    });
}

function fetchProducts(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    fetchProduct(i);
  }
}

function createProduct(product) {
  let flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  let cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  let card = document.createElement("div");
  card.classList.add("product-block");

  let imageContainer = document.createElement("div");
  imageContainer.classList.add("img-container");

  let image = document.createElement("img");
  image.src = product.image;
  image.style.width = "100%";
  image.style.height = "500px";

  imageContainer.appendChild(image);

  let title = document.createElement("p");
  title.textContent = product.title;
  title.style.fontWeight = "bold";

  let price = document.createElement("p");
  price.textContent = `$ ${product.price}`;

  card.appendChild(imageContainer);
  card.appendChild(title);
  card.appendChild(price);

  let cardBack = document.createElement("div");
  cardBack.classList.add("product-block-back");

  let category = document.createElement("p");
  category.textContent = formatCamelCase(product.category);
  category.style.fontWeight = "bold";

  let description = document.createElement("p");
  description.textContent = `${product.description}`;

  let buttonPurchase = document.createElement("button");
  buttonPurchase.classList.add("button-purchase");
  buttonPurchase.textContent = 'Buy';
  buttonPurchase.style.fontWeight = "bold";

  buttonPurchase.addEventListener("click", () => {
    addProductToCart(product);
  });

  cardBack.appendChild(category);
  cardBack.appendChild(description);
  cardBack.appendChild(buttonPurchase);

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  productContainer.appendChild(flipCard);
  
}

function formatCamelCase(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

fetchProducts(offset, limit);

function addProductToCart(product) {
  let productInCart = document.createElement("div");
  productInCart.classList.add("product-in-cart");

  let image = document.createElement("img");
  image.src = product.image;
  image.style.width = "100px";
  image.style.height = "100px";

  let title = document.createElement("p");
  title.textContent = product.title;
  title.style.fontWeight = "bold";

  let price = document.createElement("p");
  price.textContent = `$ ${product.price}`;

  let productsInfo = document.createElement("div");
  productsInfo.appendChild(title);
  productsInfo.appendChild(price);

  let removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.textContent = 'X';
  removeButton.addEventListener("click", () => {
    removeProductFromCart(productInCart);
  });

  productInCart.appendChild(image);
  productInCart.appendChild(productsInfo);
  productInCart.appendChild(removeButton);
  productInOffcanvas.appendChild(productInCart);
  offcanvas.show();

  productsInCart.push(product);
  updateBuyNowButton();
}

function updateBuyNowButton() {
  let buyNowButton = document.getElementById("buy-now-button");

  if (productsInCart.length > 0) {
    buyNowButton.style.display = "block";
  } else  {
    buyNowButton.style.display = "none"; 
  }
}

function removeProductFromCart(productInCart) {
  productInOffcanvas.removeChild(productInCart);
}


updateBuyNowButton();
