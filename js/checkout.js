var cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
var discountPercent = 0;
var shippingFee = 10;
var subTotal = 0;

// Products in Summary
var productsContainer = document.querySelector(".checkout__products");

for (var i = 0; i < cartProducts.length; i++) {
    var prodImg = cartProducts[i].productImage;
    var prodPrice = cartProducts[i].productPrice;
    var prodName = cartProducts[i].productName;
    var prodQuantity = cartProducts[i].productQuantity;

    var itemTotal = (prodPrice.replace("$", "") * prodQuantity);
    subTotal += itemTotal;

    var productItem = `
        <div class="checkout__product-item">
            <img src="${prodImg}" alt="${prodName}">
            <div class="checkout__product-info">
                <p class="checkout__product-name">${prodName} (x${prodQuantity})</p>
                <p class="checkout__product-price">${prodPrice}</p>
            </div>
        </div>`;
    
    productsContainer.insertAdjacentHTML("beforeend", productItem);
}

// sum total order price
function totalOrderPrice() {
    var discountValue = subTotal * discountPercent;
    var finalTotal = (subTotal + shippingFee) - discountValue;

    document.getElementById("subtotal").innerText = `$${subTotal.toFixed(2)}`;
    document.getElementById("final-total").innerText = `$${finalTotal.toFixed(2)}`;
    
    if (discountPercent > 0) {
        document.getElementById("discount-row").style.display = "flex";
        document.getElementById("discount-amount").innerText = `-$${discountValue.toFixed(2)}`;
    }
}

totalOrderPrice();

// Coupon 
document.getElementById("apply-coupon").addEventListener("click", function() {
    var couponCode = document.getElementById("coupon-input").value;

    var invlaidCouponLabel = document.querySelector(".invalid-coupon")
    invlaidCouponLabel.innerText = "";

    if(couponCode === "save10"){
        discountPercent = 0.1
    }
    else if(couponCode === "save20"){
        discountPercent = 0.2
    }
    else if(couponCode === "save30"){
        discountPercent = 0.3
    }
    else
    {
        invlaidCouponLabel.innerText="Invalid Coupon"
    }

    totalOrderPrice();
});

// Place Order
document.querySelector(".checkout__place-order-btn").addEventListener("click", function() {

    var requiredInputs = document.querySelectorAll("input[required]");
    var allFilled = true;

    for (var i = 0; i < requiredInputs.length; i++) {
        if (requiredInputs[i].value.trim() === "") {
            allFilled = false;
            requiredInputs[i].style.borderColor = "red";
            document.getElementById("required-fields").innerText="There are fields required to fill";

        } else {
            requiredInputs[i].style.borderColor = "#ddd";
        }
    }

    if (allFilled === true) {  
        localStorage.removeItem("cart");
        document.getElementById("required-fields").innerText="";
        document.getElementById("order-placed").innerText="Your order has placed successfully";
        document.getElementById("redirected-to-home").innerText="You will redirected to Home page now";

        setTimeout(function(){
            window.location.href = "home.html";
        }
        ,3000)
    }
});