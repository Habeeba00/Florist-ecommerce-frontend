document.querySelector(".theme").onclick = function() {
    document.body.classList.toggle('dark');
    
    if (this.classList.contains('fa-moon')) {
        this.classList.remove('fa-moon');
        this.classList.add('fa-sun');
    } else {
        this.classList.remove('fa-sun');
        this.classList.add('fa-moon');
    }
}

var allProducts = [];
var products = new XMLHttpRequest();
products.open("get", "../data.json");
products.send();
products.onreadystatechange = function () {
    if (products.status == 200 && products.readyState == 4) {
        var data = JSON.parse(products.responseText);
        allProducts = data.products;

        displayProducts(allProducts);
        setupCategoryFilters();
    }
};

function displayProducts(productList) {
    var productsGrid = document.querySelector(".products-grid");
    productsGrid.innerHTML = "";

    var maxProducts = 10;
    var limit = Math.min(maxProducts, productList.length);

    for (var i = 0; i < limit; i++) {
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
                        <li><a class="product__action-link" href="../html/product-details.html"><i class="product__action-icon fa-solid fa-info"></i></a></li>
                        <li><a class="product__action-link" href="../html/cart.html"><i class="product__action-icon fa-solid fa-cart-plus"></i></a></li>
                        <li><a class="product__action-link" href="../html/favorite.html"><i class="product__action-icon fa-regular fa-heart"></i></a></li>
                    </ul>
                </div>
                <div class="product__info">
                    <h5 class="product__title"><a class="product__title-link" href="#">${product.title}</a></h5>
                    <div class="product__price">$${product.price}</div>
                    <a href="../html/cart.html" class="product__cart-btn">Add to cart</a>
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
    // Info icon - go to product details
    var infoIcons = document.querySelectorAll(".product__actions li:first-child .product__action-link");
    for (var i = 0; i < infoIcons.length; i++) {
        infoIcons[i].onclick = function (e) {

            e.preventDefault();

            var productItem = this.closest(".product");
            var productId = productItem.getAttribute('data-id');
            window.location.href = "product-details.html?id=" + productId;
        };
    }

    // Cart icon - add to cart
    var cartIcons = document.querySelectorAll(".product__actions li:nth-child(2) a");
    // var cartIcons = document.querySelectorAll(".add-cart-btn");

    var storedProducts = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartNumber();

    for (var i = 0; i < cartIcons.length; i++) {

        cartIcons[i].onclick = function (e) {

            e.preventDefault();

            var productItem = this.closest(".product");

            var prodQuantity = 1;
            var prodId = productItem.getAttribute("data-id");
            var prodName = productItem.querySelector(".product__title-link").textContent;
            var prodPrice = productItem.querySelector(".product__price").textContent;
            var prodImage = productItem.querySelector(".product__image").style.backgroundImage.replace("url(\"", "").replace("\")", "");
            var isProductExist = storedProducts.findIndex(product => product.productID === prodId)


            if (!(isProductExist === -1)) {
                storedProducts[isProductExist].productQuantity++
            }

            else {
                var productData = {
                    productID: prodId,
                    productName: prodName,
                    productPrice: prodPrice,
                    productImage: prodImage,
                    productQuantity: prodQuantity
                }

                storedProducts.push(productData);
            }

            localStorage.setItem("cart", JSON.stringify(storedProducts))

            console.log(storedProducts)

            // "print 'Add to cart' notificatio"
            var notification = document.createElement("div");
            notification.setAttribute("class", "added-notification")

            notification.innerText = "Added to cart!";
            document.body.append(notification);
            setTimeout(function () {
                notification.remove()
            }, 3000)

            updateCartNumber();
        };
    }

        // increasing cart icon number in nav bar out of for loop
    function updateCartNumber(){
        var cartNum = 0;
        for (var i = 0; i < storedProducts.length; i++) {
            cartNum += storedProducts[i].productQuantity; 
        }
        document.querySelector(".cart-number").innerText = cartNum
    }

    

    // Heart icon - add to wishlist
    var heartIcons = document.querySelectorAll(".product__actions li:nth-child(3) .product__action-link");
    for (var i = 0; i < heartIcons.length; i++) {
        heartIcons[i].onclick = function (e) {
            e.preventDefault();

            var productItem = this.closest(".product");
            var productId = productItem.getAttribute("data-id");
            var prodName = productItem.querySelector(".product-title").textContent;
            var prodPrice = productItem.querySelector(".price").textContent;
            var prodImage = productItem.querySelector(".product__item__pic").style.backgroundImage.replace("url(\"", "").replace("\")", "");
            var isProductExist = storedProducts.findIndex(product => product.productID === prodId)

            window.location.href = "?id=" + productId;
            console.log("Add product " + productId + " to wishlist");
        };
    }
}




    


// Hero section image switching
let hero_img = document.querySelector('.hero-section__img');
let background_color = document.querySelector('.hero-section');

function switchImage(image) {
    hero_img.src = image;
}

function switchColor(color) {
    background_color.style.background = color;
}


// Slider functionality
var arr = [
    '../images/OIP0.jpg',
    '../images/OIP01.jpg',
    '../images/OIP02.jpg',
    '../images/OPI03.webp',
    '../images/OIP04.jpg',
    '../images/OIP.jpg',
    '../images/OIP1.jpg',
    '../images/OIP2.jpg'
];

var sliderTrack = document.getElementById('slider-track');
var i = 0;
var time;

// Populate slider with images
arr.forEach(function (src) {
    var img = document.createElement('img');
    img.src = src;
    sliderTrack.appendChild(img);
});
arr.forEach(function (src) {
    var img = document.createElement('img');
    img.src = src;
    sliderTrack.appendChild(img);
});

// Slider button events
var sliderButtons = document.querySelectorAll('.slider__btn');
if (sliderButtons.length >= 4) {
    // Next button
    sliderButtons[3].onclick = function () {
        i++;
        if (i > arr.length - 1) {
            i = 0;
        }
        sliderTrack.style.transform = 'translateX(-' + (i * 210) + 'px)';
    }

    // Prev button
    sliderButtons[0].onclick = function () {
        i--;
        if (i < 0) {
            i = arr.length - 1;
        }
        sliderTrack.style.transform = 'translateX(-' + (i * 210) + 'px)';
    }

    // Start button
    sliderButtons[1].onclick = function () {
        if (!time) {
            time = setInterval(function () {
                i++;
                if (i > arr.length - 1) {
                    i = 0;
                }
                sliderTrack.style.transform = 'translateX(-' + (i * 210) + 'px)';
            }, 2000);
        }
    }

    // Stop button
    sliderButtons[2].onclick = function () {
        clearInterval(time);
        time = null;
    }
}

