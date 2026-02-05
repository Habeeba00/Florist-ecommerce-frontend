var cartProducts = JSON.parse(localStorage.getItem("cart"))

updateCartNumber();

console.log(cartProducts)

var subTotal = 0;

for (var i = 0; i < cartProducts.length; i++) {

    var emptyCart = document.querySelector(".cart__empty")

    if(emptyCart) {
        emptyCart.closest("tr").remove();
    }
    
    var prodImg = cartProducts[i].productImage
    var prodPrice = cartProducts[i].productPrice
    var prodName = cartProducts[i].productName
    var prodId = cartProducts[i].productID
    var prodQuantity = cartProducts[i].productQuantity

    var delIcon = (prodQuantity > 1) ? "-" : "<i class='fa-regular fa-trash-can'></i>"

    var totalPriceOfItem = (prodPrice.replace("$","") * prodQuantity)

    subTotal += totalPriceOfItem

    var productRow = `
        <tr prod-id="${prodId}">
            <td class="cart__product"><img src="${prodImg}" width="100px"> <label class="cart__product-name">${prodName}</label></td>
            <td class="cart__price">${prodPrice}</td>
            <td class="cart__quantity-col">
                <div class="cart__quantity">
                    <button class="cart__quantity-btn cart__quantity-btn--minus">${delIcon}</button>
                    <input type="number" value="${prodQuantity}" class="cart__quantity-input" readonly>
                    <button class="cart__quantity-btn cart__quantity-btn--plus">+</button>
                </div>
            </td>
            <td class="cart__total">$${totalPriceOfItem.toFixed(2)}</td>
        </tr>`

    var tableBody = document.querySelector(".cart__body");

    tableBody.insertAdjacentHTML("beforeend", productRow)
}

// print subtotal when refreshing
document.querySelector(".cart__checkout > h3").innerText = `Subtotal: $${subTotal.toFixed(2)}`

tableBody.addEventListener("click", function (e) {

    // increase product price
    if (e.target.classList.contains("cart__quantity-btn--plus")) {
        var row = e.target.closest("tr")

        var getProdId = row.getAttribute("prod-id")
        var prodIndex = cartProducts.findIndex(product => product.productID === getProdId)

        var currentQuantity = row.querySelector("input").value
    
        currentQuantity++
    
        cartProducts[prodIndex].productQuantity++

        if (currentQuantity > 1) {
            row.querySelector(".cart__quantity-btn--minus").innerText = "-"
        }

        var priceOfItem = row.querySelector(".cart__price").innerText.replace("$", "")

        var totalProductPrice = priceOfItem * currentQuantity
        totalProductPrice = totalProductPrice.toFixed(2)

        row.querySelector("input").setAttribute("value", currentQuantity)

        row.querySelector(".cart__total").innerText = `$${totalProductPrice}`

        localStorage.setItem("cart", JSON.stringify(cartProducts))

        // increase subtotal value
        subTotal += parseFloat(priceOfItem)
        document.querySelector(".cart__checkout > h3").innerText = `Subtotal: $${subTotal.toFixed(2)}`

        console.log(totalProductPrice);

        updateCartNumber();
    }

    // Decrease product price
    if (e.target.closest(".cart__quantity-btn--minus")) {
        var row = e.target.closest("tr")
        var currentQuantity = row.querySelector("input").value

        var getProdId = row.getAttribute("prod-id")
        var prodIndex = cartProducts.findIndex(product => product.productID === getProdId)
        var itmPrice = row.querySelector(".cart__price").innerText.replace("$", "")

        // here we will remove the product from the array and localStorage
        if(currentQuantity == "1") {
            
            cartProducts.splice(prodIndex, 1)

            localStorage.setItem("cart", JSON.stringify(cartProducts))
        
            row.remove()

            subTotal -= parseFloat(itmPrice)
            document.querySelector(".cart__checkout > h3").innerText = `Subtotal: $${subTotal.toFixed(2)}`

            // print empty cart if array of products become empty
            if(cartProducts.length === 0) {
                var tableBody = document.querySelector(".cart__body")
                var emptyCart = `<tr>
                    <td colspan="4" class="cart__empty">The cart is empty</td>
                </tr>`
                tableBody.insertAdjacentHTML("beforeend", emptyCart)

                document.querySelector(".cart__checkout > h3").innerText = `Subtotal: $0.00`
            }
            updateCartNumber();
            return;
        }

        if (currentQuantity >= 1) {

            cartProducts[prodIndex].productQuantity--
            currentQuantity--
            row.querySelector("input").setAttribute("value", currentQuantity)

            // calculate the total price of a product
            var currentTotalProductPrice = row.querySelector(".cart__total").innerText.replace("$", "")
            var itemPrice = row.querySelector(".cart__price").innerText.replace("$", "")

            totalProductPrice = currentTotalProductPrice - itemPrice
            totalProductPrice = totalProductPrice.toFixed(2)
            row.querySelector(".cart__total").innerText = `$${totalProductPrice}`

            localStorage.setItem("cart", JSON.stringify(cartProducts))

            // decrease subtotal value
            subTotal -= parseFloat(itemPrice)
            document.querySelector(".cart__checkout > h3").innerText = `Subtotal: $${subTotal.toFixed(2)}`
        }

        if (currentQuantity === 1) {
            row.querySelector(".cart__quantity-btn--minus").innerHTML = "<i class='fa-regular fa-trash-can'></i>"
        }
        updateCartNumber();
    }
})


function updateCartNumber(){
    var cartNum = 0;
    for (var i = 0; i < cartProducts.length; i++) {
        cartNum += cartProducts[i].productQuantity; 
    }
    document.querySelector(".cart-number").innerText = cartNum
}