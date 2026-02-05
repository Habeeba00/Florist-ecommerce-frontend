
var url = window.location.search;
var urlParams = new URLSearchParams(url);
var productId = urlParams.get('id');

var productDetailsReq = new XMLHttpRequest();
productDetailsReq.open('GET', '../data.json');
productDetailsReq.send();

productDetailsReq.onreadystatechange = function() {
    if (productDetailsReq.status == 200 && productDetailsReq.readyState == 4) {
        var data = JSON.parse(productDetailsReq.responseText);
        
        var product = null;
        for (var i = 0; i < data.products.length; i++) {
            if (data.products[i].id == productId) {
                product = data.products[i];
                break;
            }
        }
        
        if (product) {
            currentProduct = product;
            displayProductDetails(currentProduct);
            productToCart(currentProduct);
        } else {
            document.body.innerHTML = '<h1 style="text-align:center; margin-top:100px;">Product not found!</h1>';
        }
    }
}

function displayProductDetails(product) {
    document.getElementById('breadcrumbTitle').textContent = product.title;
    displayGallery(product);
    displayInfo(product);
}

function displayGallery(product) {
    var galleryContainer = document.getElementById('productGallery');

    var productImages = [];
    
    if (product.thumbnail && product.thumbnail !== "...") {
        productImages.push(product.thumbnail);
    }
    
    // Add hover images
    if (product.images && product.images.length > 0) {
        for (var i = 0; i < product.images.length; i++) {
            if (product.images[i] !== "...") {
                productImages.push(product.images[i]);
            }
        }
    }

    // If no images available, use placeholder
    if (productImages.length === 0) {
        productImages.push('https://via.placeholder.com/500x500/FF69B4/FFFFFF?text=No+Image');
    }

    var galleryHTML = '<div class="product-details__main-image" id="mainImage" style="background-image: url(' + productImages[0] + ')"></div>';
    galleryHTML += '<div class="product-details__thumbnails" id="thumbnailContainer">';

    for (var i = 0; i < productImages.length; i++) {
        galleryHTML += '<img src="' + productImages[i] + '" alt="Product image ' + (i + 1) + '" class="product-details__thumbnail">';
    }
    
    galleryHTML += '</div>';
    galleryContainer.innerHTML = galleryHTML;
    
    var thumbnails = document.querySelectorAll('.product-details__thumbnail');
    var mainImage = document.getElementById('mainImage');
    var originalImage = productImages[0];
    
    for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].addEventListener('click', function(e) {
            mainImage.style.backgroundImage = 'url(' + e.target.src + ')';
            originalImage = e.target.src;
        });

        thumbnails[i].addEventListener('mouseover', function(e) {
            mainImage.style.backgroundImage = 'url(' + e.target.src + ')';
        });

        thumbnails[i].addEventListener('mouseout', function() {
            mainImage.style.backgroundImage = 'url(' + originalImage + ')';
        });
    }
}

function displayInfo(product) {
    var infoContainer = document.getElementById('productInfo');

    var stars = '';
    var fullStars = Math.round(product.rating);
    for (var i = 0; i < 5; i++) {
        stars += i < fullStars ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }

    var priceHTML = '<i class="fa-solid fa-dollar-sign"></i>' + product.price;
    if (product.discountPercentage > 0) {
        var originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
        priceHTML = '<i class="fa-solid fa-dollar-sign"></i>' + product.price + ' <span class="product-details__original-price">$' + originalPrice + '</span>';
    }

    var availabilityText = '';
    var availabilityColor = '';
    if (product.stock === 0) {
        availabilityText = 'Out of Stock';
        availabilityColor = '#e74c3c';
    } else if (product.stock < 10) {
        availabilityText = 'Low Stock - Only ' + product.stock + ' left';
        availabilityColor = '#f39c12';
    } else {
        availabilityText = 'In Stock';
        availabilityColor = '#42a545';
    }

    var reviewCount = product.reviews ? product.reviews.length : 0;

    var infoHTML = `
        <div class="product-details__category">${product.category}</div>
        <h1 class="product-details__title">${product.title}</h1>
        
        <div class="product-details__rating">
            <span class="product-details__stars">${stars}</span>
            <span class="product-details__review-count">(${reviewCount} reviews)</span>
        </div>

        <div class="product-details__price">${priceHTML}</div>

        <p class="product-details__description">${product.description}</p>

        <div class="product-details__options">
            <div class="product-details__option-group">
                <label class="product-details__option-label">Size:</label>
                <div class="product-details__size-options">
                    <button class="product-details__size-btn">Small</button>
                    <button class="product-details__size-btn product-details__size-btn--active">Medium</button>
                    <button class="product-details__size-btn">Large</button>
                </div>
            </div>

            <div class="product-details__option-group">
                <label class="product-details__option-label">Quantity:</label>
                <div class="product-details__quantity">
                    <div class="product-details__quantity-control">
                        <button class="product-details__quantity-btn" id="decreaseBtn">−</button>
                        <div class="product-details__quantity-value" id="quantity">1</div>
                        <button class="product-details__quantity-btn" id="increaseBtn">+</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="product-details__actions">
            <button class="product-details__cart-btn" id="addToCartBtn">Add to Cart</button>
            <button class="product-details__wishlist-btn"><i class="fa-regular fa-heart"></i></button>
        </div>

        <div class="product-details__meta">
            <div class="product-details__meta-item">
                <span class="product-details__meta-label">SKU:</span>
                <span>${product.sku}</span>
            </div>
            <div class="product-details__meta-item">
                <span class="product-details__meta-label">Category:</span>
                <span>${product.category}</span>
            </div>
            <div class="product-details__meta-item">
                <span class="product-details__meta-label">Availability:</span>
                <span style="color: ${availabilityColor};">${availabilityText}</span>
            </div>
            <div class="product-details__meta-item">
                <span class="product-details__meta-label">Shipping:</span>
                <span>${product.shippingInformation || 'Standard shipping'}</span>
            </div>
        </div>

        <div class="product-details__reviews">
            <h3 class="product-details__reviews-title">Customer Reviews</h3>
            <div id="reviewsList"></div>
        </div>
    `;

    infoContainer.innerHTML = infoHTML;
    displayReviews(product.reviews);
}

// ----------------------------------------------------------------------

var currentProduct = null; 

function productToCart(product) {
    var quantityValue = document.getElementById('quantity');
    var increaseBtn = document.getElementById('increaseBtn');
    var decreaseBtn = document.getElementById('decreaseBtn');
    var addToCartBtn = document.getElementById('addToCartBtn');
    var sizeButtons = document.querySelectorAll('.product-details__size-btn');

    for (var i = 0; i < sizeButtons.length; i++) {
        sizeButtons[i].onclick = function() {
            for (var j = 0; j < sizeButtons.length; j++) {
                sizeButtons[j].classList.remove('product-details__size-btn--active');
            }
            this.classList.add('product-details__size-btn--active');
        };
    }

    // Quantity Increase
    increaseBtn.onclick = function() {
        var currentQuantity = parseInt(quantityValue.innerText);
        quantityValue.innerText = currentQuantity + 1;
    };

    // Quantity Decrease
    decreaseBtn.onclick = function() {
        var currentQuantity = parseInt(quantityValue.innerText);
        if (currentQuantity > 1) {
            quantityValue.innerText = currentQuantity - 1;
        }
    };

    // Add to Cart
    addToCartBtn.onclick = function() {
        var storedProducts = JSON.parse(localStorage.getItem("cart")) || [];
        var selectedQuantity = parseInt(quantityValue.innerText);
        
        var prodId = product.id.toString();
        var prodName = product.title;
        var prodPrice = "$" + product.price;
        var prodImage = product.thumbnail;

        //product index in array
        var isProductExist = storedProducts.findIndex(product => product.productID === prodId);
        
        // if product exist
        if (isProductExist !== -1) {

            storedProducts[isProductExist].productQuantity += selectedQuantity;
        }
        else {
            var productData = {
                productID: prodId,
                productName: prodName,
                productPrice: prodPrice,
                productImage: prodImage,
                productQuantity: selectedQuantity
            };
            storedProducts.push(productData);
        }

        localStorage.setItem("cart", JSON.stringify(storedProducts));

        // "print 'Add to cart' notificatio"
        var notification = document.createElement("div");
        notification.setAttribute("class", "added-notification")

        notification.innerText = "Added to cart!";
        document.body.append(notification);
        setTimeout(function () {
            notification.remove()
        }, 3000)
    };
}

// -----------------------------------------------------------------------

function displayReviews(reviews) {
    var reviewsList = document.getElementById('reviewsList');
    
    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color: #999;">No reviews yet.</p>';
        return;
    }
    
    var reviewsHTML = '';
    for (var i = 0; i < reviews.length; i++) {
        var review = reviews[i];
        
        var stars = '';
        for (var j = 0; j < 5; j++) {
            stars += j < review.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
        }

        reviewsHTML += `
            <div class="product-details__review-item">
                <div class="product-details__review-header">
                    <span class="product-details__reviewer-name">${review.reviewerName}</span>
                    <span class="product-details__review-rating">${stars}</span>
                </div>
                <p class="product-details__review-comment">${review.comment}</p>
            </div>
        `;
    }
    reviewsList.innerHTML = reviewsHTML;
}