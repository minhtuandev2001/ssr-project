// sort
const radioSort = document.querySelectorAll("[sort-product-radio]")
if (radioSort.length > 0) {
  let url = new URL(window.location.href)
  radioSort.forEach(input => {
    input.addEventListener("click", () => {
      const value = input.getAttribute("value");
      const sortKey = value.split("-")[0];
      const sortValue = value.split("-")[1];
      url.searchParams.set('sortKey', sortKey)
      url.searchParams.set('sortValue', sortValue)
      // chuyển hướng trang
      window.location.href = url.href
    })
  })
  // hiển thị ra lại giao diện
  const sortKey = url.searchParams.get('sortKey')
  const sortValue = url.searchParams.get('sortValue')
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`
    const radioSelected = document.querySelector(`input[value='${stringSort}']`)
    radioSelected.setAttribute('checked', true)
  }
}
// end sort