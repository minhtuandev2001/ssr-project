// button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status")
      console.log(status)
      if (status) {
        url.searchParams.set("status", status)
        url.searchParams.delete("page")
      } else {
        url.searchParams.delete("status")
      }
      // chuyển hướng trang 
      window.location.href = url.href
    })
  })
}
// end button status
// search products
const formSearch = document.querySelector("#form-search")
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault()
    const keyword = e.target.keyword.value
    if (keyword) {
      url.searchParams.set("keyword", keyword)
    } else {
      url.searchParams.delete("keyword")
    }
    window.location.href = url.href
  })
}
// end search products
// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]")
if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach(button => {
    button.addEventListener("click", (e) => {
      let page = button.getAttribute("button-pagination")
      url.searchParams.set("page", page)
      window.location.href = url.href
    })
  })
}
// end pagination