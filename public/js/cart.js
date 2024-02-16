const inputQuantity = document.querySelectorAll("input[name='quantity']");

if (inputQuantity) {
  inputQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id")
      const quantity = e.target.value
      if (quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`
      }
    })
  })
}