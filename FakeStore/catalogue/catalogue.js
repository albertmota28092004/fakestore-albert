var productContainer = document.querySelector(".product-container");
var spinner = document.querySelector("#spinner");
var previous = document.querySelector("#previous");
var next = document.querySelector("#next");
var offcanvas = new bootstrap.Offcanvas(document.getElementById("demo"));
var productInOffcanvas = document.querySelector(".offcanvas-body .productCar");
var productsInCart = [];
var productListContainer = document.querySelector(".product-list-container");
var cartImage = document.getElementById("cartImage");
var limit = 8;
var offset = 1;

document.addEventListener('DOMContentLoaded', () => {
  if (productsInCart.length > 0) {
    offcanvas.show();
    cartImage.style.display = "none";
  }
  console.log(productsInCart);
  console.log(productInOffcanvas);
});

previous.addEventListener("click", () => {
  if (offset != 1) {
    offset -= 9;
    removeChildNodes(productContainer);
    fetchProducts(offset, limit);
  }
});

next.addEventListener("click", () => {
  if (offset < 19) {
    offset += 9;
    removeChildNodes(productContainer);
    fetchProducts(offset, limit);
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
  image.style.width = "200px";
  image.style.height = "200px";

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
  cardBack.style.overflow = "scroll";

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
    cartImage.style.display = "none";
  });

  cardBack.appendChild(category);
  cardBack.appendChild(description);
  cardBack.appendChild(buttonPurchase);

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  productContainer.appendChild(flipCard);
}

function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchProducts(offset, limit);

function formatCamelCase(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function addProductToCart(product) {

  let idProduct = product.id;

  let existingProduct = productsInCart.find(item => item.id === idProduct);

  if (existingProduct) {
    console.log(`El producto con ID ${idProduct} ya está en el carrito.`);
    offcanvas.show();
    return;
  }

  let productInCart = document.createElement("div");
  productInCart.classList.add("product-in-cart");

  let image = document.createElement("img");
  image.classList.add("image-product-in-cart");
  image.src = product.image;
  image.style.width = "100px";
  image.style.height = "100px";
  image.dataset.productId = idProduct;

  let title = document.createElement("p");
  title.textContent = product.title;
  title.style.fontWeight = "bold";

  let price = document.createElement("p");
  price.textContent = `$ ${product.price}`;

  let productsQuantity = document.createElement('div');
  productsQuantity.classList.add("quantity-box");

  let number = document.createElement('input');
  number.type = "number";
  number.value = 1;
  number.setAttribute("readonly", "true");
  number.classList.add("number-box");

  let plus = document.createElement('button');
  plus.textContent = '+';
  plus.classList.add("plus");
  plus.addEventListener('click', () => {
    number.value++;
  });

  let minus = document.createElement('button');
  minus.textContent = '-';
  minus.classList.add("minus");
  minus.addEventListener('click', () => {
    if (number.value > 1) {
      number.value--;
    }
  });

  productsQuantity.appendChild(minus);
  productsQuantity.appendChild(number);
  productsQuantity.appendChild(plus);

  let productsInfo = document.createElement("div");
  productsInfo.appendChild(title);
  productsInfo.appendChild(price);
  productsInfo.appendChild(productsQuantity);

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
  productsInCart.push(productInOffcanvas);


  //updateBuyNowButton()
  console.log(productsInCart);
  console.log(productInOffcanvas);
}

/* function updateBuyNowButton() {
  buttonBuyNow = document.getElementById('buy-now');
  
  if (productsInCart.length > 0) {
    buttonBuyNow.removeAttribute("hidden");
  } else {
    buttonBuyNow.setAttribute("hidden", "true");
  }
}*/

function removeProductFromCart(productInCart) {
  productInOffcanvas.removeChild(productInCart);
  const productId = productInCart.querySelector(".image-product-in-cart").dataset.productId;

  productsInCart = productsInCart.filter(item => item.id !== parseInt(productId));

  if (productsInCart.length <= 0) {
    offcanvas.hide();
    cartImage.style.display = "block";

  }
  console.log(productsInCart);
  console.log(productInOffcanvas);
}
