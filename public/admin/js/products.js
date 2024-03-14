// button delete item product
const buttonDeleteProducts = document.querySelectorAll("[button-delete]");
if (buttonDeleteProducts.length > 0) {
  const formDeleteProduct = document.querySelector("[id='form-delete-product']")
  const path = formDeleteProduct.getAttribute("data-path")
  buttonDeleteProducts.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn xác nhận xóa ?")
      if (isConfirm) {
        const id = button.getAttribute("data-id")
        const action = path + `/${id}/?_method=DELETE`
        console.log("check action", action)
        formDeleteProduct.action = action
        formDeleteProduct.submit()
      }
    })
  })
}
// end button delete item product


