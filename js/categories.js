/* ===== GET PRODUCTS FROM API ===== */
var request = new XMLHttpRequest();
request.open("GET", "https://dummyjson.com/products?limit=100");
request.send();

request.onreadystatechange = function () {
  if (request.readyState === 4 && request.status === 200) {
    var data = JSON.parse(request.responseText);
    var products = data.products;

    var counts = {};

    // count products by category
    products.forEach(function (product) {
      if (counts[product.category]) {
        counts[product.category]++;
      } else {
        counts[product.category] = 1;
      }
    });

    setCount("fragrances", counts["fragrances"]);
    setCount("beauty", counts["beauty"]);
    setCount("groceries", counts["groceries"]);
    setCount("furniture", counts["furniture"]);
  }
};

/* ===== SET COUNT IN HTML ===== */
function setCount(category, count) {
  var el = document.getElementById(category + "-count");
  if (el) {
    el.innerText = `(${count || 0} items)`;
  }
}

/* ===== CLICK CATEGORY ===== */
document.querySelectorAll(".categories__card").forEach(function (card) {
  card.onclick = function () {
    var category = this.dataset.category;
    window.location.href = "../html/all-products.html?category=" + category;
  };
});
