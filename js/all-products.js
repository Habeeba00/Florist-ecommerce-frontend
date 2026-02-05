

var allProducts = [];

var request = new XMLHttpRequest();
request.open("GET", "../data.json");
request.send();

request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
        var data = JSON.parse(request.responseText);
        allProducts = data.products;
        
        displayProducts(allProducts);
        setupCategoryFilters();
    }
};

function displayProducts(productList) {
    var productsGrid = document.querySelector(".products-grid");
    productsGrid.innerHTML = "";

    for (var i = 0; i < productList.length; i++) {
        var product = productList[i];
        var productImage = product.thumbnail;
        var label = "";

        if (product.stock < 10) {
            label = '<div class="product__label product__label--out-of-stock">Out Of Stock</div>';
        } else if (product.discountPercentage > 15) {
            label = '<div class="product__label product__label--sale">Sale</div>';
        } else if (i < 5) {
            label = '<div class="product__label product__label--new">New</div>';
        }

        productsGrid.innerHTML += `
            <div class="product" data-id="${product.id}">
                <div class="product__image" style="background-image: url('${productImage}');">
                    ${label}
                    <ul class="product__actions">
                        <li><a class="product__action-link" href="product-details.html?id=${product.id}"><i class="product__action-icon fa-solid fa-info"></i></a></li>
                        <li><a class="product__action-link add-to-cart" href="#"><i class="product__action-icon fa-solid fa-cart-plus"></i></a></li>
                        <li><a class="product__action-link" href="favorite.html"><i class="product__action-icon fa-regular fa-heart"></i></a></li>
                    </ul>
                </div>
                <div class="product__info">
                    <h5 class="product__title"><a class="product__title-link" href="product-details.html?id=${product.id}">${product.title}</a></h5>
                    <div class="product__price">$${product.price}</div>
                    <a href="#" class="product__cart-btn add-to-cart-btn">Add to cart</a>
                </div>
            </div>
        `;
    }
    
    setupProductClick();
}

function setupCategoryFilters() {
    var filterButtons = document.querySelectorAll(".filter__item");

    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].onclick = function () {
            for (var j = 0; j < filterButtons.length; j++) {
                filterButtons[j].classList.remove("filter__item--active");
            }

            this.classList.add("filter__item--active");

            var category = this.getAttribute("data-category");

            if (category === "all") {
                displayProducts(allProducts);
            } else {
                var filteredProducts = [];
                for (var k = 0; k < allProducts.length; k++) {
                    if (allProducts[k].category === category) {
                        filteredProducts.push(allProducts[k]);
                    }
                }
                displayProducts(filteredProducts);
            }
        };
    }
}

function setupProductClick() {
    var cartIcons = document.querySelectorAll(".add-to-cart, .add-to-cart-btn");
    var storedProducts = JSON.parse(localStorage.getItem("cart")) || [];

    for (var i = 0; i < cartIcons.length; i++) {
        cartIcons[i].onclick = function (e) {
            e.preventDefault();

            var productItem = this.closest(".product");
            var prodId = productItem.getAttribute("data-id");
            var prodName = productItem.querySelector(".product__title-link").textContent;
            var prodPrice = productItem.querySelector(".product__price").textContent;
            var prodImage = productItem.querySelector(".product__image").style.backgroundImage.replace("url(\"", "").replace("\")", "");
            
            var isProductExist = storedProducts.findIndex(product => product.productID === prodId);

            if (isProductExist !== -1) {
                storedProducts[isProductExist].productQuantity++;
            } else {
                var productData = {
                    productID: prodId,
                    productName: prodName,
                    productPrice: prodPrice,
                    productImage: prodImage,
                    productQuantity: 1
                };
                storedProducts.push(productData);
            }

            localStorage.setItem("cart", JSON.stringify(storedProducts));

            var notification = document.createElement("div");
            notification.setAttribute("class", "added-notification");
            notification.innerText = "Added to cart!";
            document.body.append(notification);
            
            setTimeout(function () {
                notification.remove();
            }, 3000);
        };
    }
}